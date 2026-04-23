/**
 * Typography に関する関数をまとめたファイル
 */
import type { Ref } from 'vue'
import { onMounted, onUpdated, watch } from 'vue'
import { useString } from '../string'
import { useUI } from '../ui'
import { segmentText } from '../text-segmenter'
import type { UIConfig } from '../../types'
import type { TypographyConfig, FontFamily, FontWeight, TypeFace } from '../../types/typography'
import { useAppConfig, useState, readonly } from '#imports'

const DATA_VALUE = 'typography'

const PROCESSED_ATTR = 'data-baseline-processed'
const CLASS_JA = 'typography-ja'
const CLASS_LATIN = 'typography-latin'

export const useTypography = () => {
	const config = useState<TypographyConfig | null>('ui-typography-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		// window object がない場合は何もしない
		if (typeof window === 'undefined' || !window.getComputedStyle) {
			throw new Error('Typography の初期化に失敗しました。windowオブジェクトが存在しないか、window.getComputedStyleが利用できません。')
		}

		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.typography) return null

		config.value = appConfig.typography
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			// valueの型を明示的に指定
			const typedValue = value as { family?: FontFamily, weight?: FontWeight, latinBaselineAdjust?: string } | TypeFace

			if (key === 'font') {
				if ('family' in typedValue && typedValue.family) {
					cssVariables += `
					--typography-font-family: ${typedValue.family.base || 'inherit'};
					--typography-font-family-serif: ${typedValue.family.serif || 'inherit'};
					--typography-font-family-en: ${typedValue.family.en || 'inherit'};
					--typography-font-family-normal: ${typedValue.family.normal || 'inherit'};
					--typography-font-family-bold: ${typedValue.family.bold || 'inherit'};
					--typography-font-family-extrabold: ${typedValue.family.extrabold || 'inherit'};
				`
				}
				if ('weight' in typedValue && typedValue.weight) {
					cssVariables += `
					--typography-font-weight-normal: ${typedValue.weight.normal || 'inherit'};
					--typography-font-weight-bold: ${typedValue.weight.bold || 'inherit'};
					--typography-font-weight-extrabold: ${typedValue.weight.extrabold || 'inherit'};
				`
				}
				if ('latinBaselineAdjust' in typedValue && typedValue.latinBaselineAdjust) {
					cssVariables += `
					--typography-font-latin-baseline-adjust: ${typedValue.latinBaselineAdjust};
				`
				}
			}
			else if (isTypeFace(typedValue)) {
				cssVariables += `
				--typography-${useString().camelToKebab(key)}-font-family: ${typedValue.fontFamily || 'inherit'};
				--typography-${useString().camelToKebab(key)}-font-size: ${typedValue.fontSize || 'inherit'};
				--typography-${useString().camelToKebab(key)}-font-weight: ${typedValue.fontWeight || 'normal'};
				--typography-${useString().camelToKebab(key)}-line-height: ${typedValue.lineHeight || 1.675};
				--typography-${useString().camelToKebab(key)}-cap-height-baseline-top: ${typedValue.capHeightBaselineTop || '0em'};
				--typography-${useString().camelToKebab(key)}-cap-height-baseline-bottom: ${typedValue.capHeightBaselineBottom || '0em'};
				${typedValue.latinBaselineAdjust ? `--typography-${useString().camelToKebab(key)}-latin-baseline-adjust: ${typedValue.latinBaselineAdjust};` : ''}
			`
			}
			else if (key === 'mark') {
				cssVariables += `
				--typography-mark: var(--${typedValue});
			`
			}
		}
		cssVariables += '}'

		styleElement.innerHTML = cssVariables
		document.head.appendChild(styleElement)

		return true
	}

	// TypeFace 型を確認するための型ガード関数
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const isTypeFace = (value: any): value is TypeFace => {
		return value && typeof value === 'object' && ('fontSize' in value || 'fontWeight' in value || 'lineHeight' in value)
	}

	// ---- 欧文・和文混植ベースライン調整 ----

	/**
	 * latinBaselineAdjust が設定されているかを確認する
	 * TypeFace レベル → font レベルの優先順位
	 */
	const hasLatinBaselineAdjust = (typeName: string): boolean => {
		if (!config.value) return false

		const typeFace = config.value[typeName as keyof TypographyConfig]
		if (typeFace && typeof typeFace === 'object' && 'latinBaselineAdjust' in typeFace && typeFace.latinBaselineAdjust) {
			return true
		}

		if (config.value.font?.latinBaselineAdjust) {
			return true
		}

		return false
	}

	/**
	 * 処理済みの span を元のテキストノードに戻す
	 */
	const unwrapProcessedSpans = (el: HTMLElement) => {
		const spans = el.querySelectorAll(`.${CLASS_JA}, .${CLASS_LATIN}`)
		spans.forEach((span) => {
			const parent = span.parentNode
			if (!parent) return
			const textNode = document.createTextNode(span.textContent || '')
			parent.replaceChild(textNode, span)
		})
		el.normalize()
		el.removeAttribute(PROCESSED_ATTR)
	}

	/**
	 * テキストノードをセグメント化された span に置換する
	 */
	const processTextNode = (textNode: Text) => {
		const text = textNode.textContent
		if (!text || !text.trim()) return

		const segments = segmentText(text)
		if (segments.length === 0) return

		const firstType = segments[0]?.type
		const allSameType = firstType !== undefined && segments.every(s => s.type === firstType)
		if (allSameType) return

		const fragment = document.createDocumentFragment()
		segments.forEach((segment) => {
			const span = document.createElement('span')
			span.className = segment.type === 'ja' ? CLASS_JA : CLASS_LATIN
			span.textContent = segment.text
			fragment.appendChild(span)
		})

		textNode.parentNode?.replaceChild(fragment, textNode)
	}

	/**
	 * 要素内のテキストノードを再帰的に走査・処理する
	 */
	const walkAndProcess = (node: Node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			processTextNode(node as Text)
			return
		}

		if (node.nodeType === Node.ELEMENT_NODE) {
			const el = node as HTMLElement
			if (el.classList.contains(CLASS_JA) || el.classList.contains(CLASS_LATIN)) return

			const children = Array.from(el.childNodes)
			children.forEach(child => walkAndProcess(child))
		}
	}

	/**
	 * 欧文・和文混植時のベースライン調整を適用する
	 * Typography コンポーネントから呼び出す
	 * @param elRef ルート要素への ref
	 * @param typeName タイポグラフィタイプ名 (e.g. 'body', 'title1')
	 */
	const applyLatinBaselineAdjust = (elRef: Ref<HTMLElement | null>, typeName: Ref<string>) => {
		const apply = () => {
			const el = elRef.value
			if (!el) return

			if (!hasLatinBaselineAdjust(typeName.value)) {
				if (el.hasAttribute(PROCESSED_ATTR)) {
					unwrapProcessedSpans(el)
				}
				return
			}

			if (el.hasAttribute(PROCESSED_ATTR)) {
				unwrapProcessedSpans(el)
			}

			walkAndProcess(el)
			el.setAttribute(PROCESSED_ATTR, '')
		}

		onMounted(apply)
		onUpdated(apply)
		watch(typeName, apply)
	}

	return {
		init,
		isTypeFace,
		applyLatinBaselineAdjust,
		font: {
			family: {
				base: config.value ? readonly(config.value).font.family.base : '',
				serif: config.value ? readonly(config.value).font.family.serif : '',
				en: config.value ? readonly(config.value).font.family.en : '',
				normal: config.value ? readonly(config.value).font.family.normal : '',
				bold: config.value ? readonly(config.value).font.family.bold : '',
				extrabold: config.value ? readonly(config.value).font.family.extrabold : '',
			},
			weight: {
				normal: config.value ? readonly(config.value).font.weight.normal : '',
				bold: config.value ? readonly(config.value).font.weight.bold : '',
				extrabold: config.value ? readonly(config.value).font.weight.extrabold : '',
			},
		},
	}
}

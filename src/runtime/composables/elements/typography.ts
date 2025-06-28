/**
 * Typography に関する関数をまとめたファイル
 */
import { useString } from '../string'
import { useUI } from '../ui'
import type { UIConfig } from '../../types'
import type { TypographyConfig, FontFamily, FontWeight, TypeFace } from '../../types/typography'
import { useAppConfig, useState, readonly } from '#imports'

const DATA_VALUE = 'typography'

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

		const appConfig = useAppConfig().ui as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.typography) return null

		config.value = appConfig.typography
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			// valueの型を明示的に指定
			const typedValue = value as { family?: FontFamily, weight?: FontWeight } | TypeFace

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
			}
			else if (isTypeFace(typedValue)) {
				cssVariables += `
				--typography-${useString().camelToKebab(key)}-font-family: ${typedValue.fontFamily || 'inherit'};
				--typography-${useString().camelToKebab(key)}-font-size: ${typedValue.fontSize || 'inherit'};
				--typography-${useString().camelToKebab(key)}-font-weight: ${typedValue.fontWeight || 'normal'};
				--typography-${useString().camelToKebab(key)}-line-height: ${typedValue.lineHeight || 1.675};
				--typography-${useString().camelToKebab(key)}-cap-height-baseline-top: ${typedValue.capHeightBaselineTop || '0em'};
				--typography-${useString().camelToKebab(key)}-cap-height-baseline-bottom: ${typedValue.capHeightBaselineBottom || '0em'};
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

	return {
		init,
		isTypeFace,
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

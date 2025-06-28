/**
 * Gradation に関する関数をまとめたファイル
 */
import type { UIConfig } from '../types/index'
import type { GradationConfig } from '../types/gradation'
import { useUI } from './ui'
import { useState, readonly, useAppConfig } from '#imports'

const DATA_VALUE = 'gradation'

export const useGradation = () => {
	const config = useState<GradationConfig | null>('ui-gradation-config', () => null)

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
		if (!appConfig.gradation) return

		config.value = appConfig.gradation
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			cssVariables += `
					--gradation-${key}: ${value};
				`
		}
		cssVariables += '}'

		styleElement.innerHTML = cssVariables
		document.head.appendChild(styleElement)

		return true
	}

	/**
	 * 該当するグラデーションの変数を返す
	 */
	const variables = (name: string) => {
		if (typeof window === 'undefined' || !window.getComputedStyle) return ''
		if (!config.value) return ''
		if (!(name in config.value)) return ''
		return `var(--gradation-${name})`
	}

	return {
		init,
		variables,
		config: readonly(config),
	}
}

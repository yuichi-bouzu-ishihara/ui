/**
 * Container に関する関数をまとめたファイル
 */
import { useUI } from '../ui'
import { useString } from '../string'
import type { UIConfig } from '../../types'
import type { TabsConfig } from '../../types/tabs'
import { useAppConfig, useState, readonly } from '#imports'

// Constants ----------------------------------------------------------------------------------------------------------
const DATA_VALUE = 'tabs'

export const useTabs = () => {
	const config = useState<TabsConfig | null>('ui-tabs-config', () => null)

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
		if (!appConfig.tabs) return null

		config.value = appConfig.tabs
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			let val = value
			if (key.includes('Color') || key.includes('color')) {
				val = `var(--${value})`
			}
			cssVariables += `
					--${DATA_VALUE}-${useString().camelToKebab(key)}: ${val};
				`
		}
		cssVariables += '}'

		styleElement.innerHTML = cssVariables
		document.head.appendChild(styleElement)

		return true
	}

	return {
		init,
		config: readonly(config),
		typography: config.value?.typography ? readonly(config.value).typography : '',
		height: config.value?.height ? readonly(config.value).height : '',
		barRadius: config.value?.barRadius ? readonly(config.value).barRadius : '',
		barHeight: config.value?.barHeight ? readonly(config.value).barHeight : '',
		barColor: config.value?.barColor ? readonly(config.value).barColor : '',
		barBackgroundHeight: config.value?.barBackgroundHeight ? readonly(config.value).barBackgroundHeight : '',
		barBackgroundColor: config.value?.barBackgroundColor ? readonly(config.value).barBackgroundColor : '',
	}
}

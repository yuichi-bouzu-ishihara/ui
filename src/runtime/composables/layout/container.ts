/**
 * Container に関する関数をまとめたファイル
 */
import { useUI } from '../ui'
import { useString } from '../string'
import type { UIConfig } from '../../types'
import type { ContainerConfig } from '../../types/container'
import { useAppConfig, useState, readonly } from '#imports'

// Constants ----------------------------------------------------------------------------------------------------------
const DATA_VALUE = 'container'

export const useContainer = () => {
	const config = useState<ContainerConfig | null>('ui-container-config', () => null)

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
		if (!appConfig.container) return null

		config.value = appConfig.container
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			cssVariables += `
					--${DATA_VALUE}-${useString().camelToKebab(key)}: ${value};
				`
		}
		cssVariables += '}'

		styleElement.innerHTML = cssVariables
		document.head.appendChild(styleElement)

		return true
	}

	return {
		init,
		base: config.value ? readonly(config.value).base : '',
		wide: config.value ? readonly(config.value).wide : '',
		narrow: config.value ? readonly(config.value).narrow : '',
		minSideSpace: config.value ? readonly(config.value).minSideSpace : '',
	}
}

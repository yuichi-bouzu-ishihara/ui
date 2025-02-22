/**
 * Loader に関する関数をまとめたファイル
 */
import { useUI } from '../ui'
import type { UIConfig } from '../../types'
import type { LogoConfig } from '../../types/logo'
import { useString } from '../string'
import { useState, useAppConfig, readonly } from '#imports'

// Constants -----------------------------------------
const DATA_VALUE = 'logo'

export const useLogo = () => {
	const config = useState<LogoConfig | null>('logoConfig', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		// window object がない場合は何もしない
		if (typeof window === 'undefined' || !window.getComputedStyle) {
			throw new Error('logo の初期化に失敗しました。windowオブジェクトが存在しないか、window.getComputedStyleが利用できません。')
		}

		const appConfig = useAppConfig().ui as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.logo) return null

		config.value = appConfig.logo
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			let cssValue = value
			// 'src' が含まれている場合、url()で囲む
			if (typeof value === 'string' && key.includes('src')) {
				cssValue = `url(${value})`
			}
			cssVariables += `
				--${DATA_VALUE}-${useString().camelToKebab(key)}: ${cssValue};
			`
		}
		cssVariables += '}'

		styleElement.innerHTML = cssVariables
		document.head.appendChild(styleElement)

		return true
	}

	return {
		init,
		src: config.value ? readonly(config.value).src : '',
		alt: config.value ? readonly(config.value).alt : '',
		width: config.value ? readonly(config.value).width : 0,
		height: config.value ? readonly(config.value).height : 0,
	}
}

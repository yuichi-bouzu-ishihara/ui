/**
 * Avatar に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { AvatarConfig } from '../../types/avatar'
import { useUI } from '../ui'
import { useString } from '../string'
import { useState, useAppConfig, readonly } from '#imports'

// Constants -----------------------------------------
const DATA_VALUE = 'avatar'

export const useAvatar = () => {
	const config = useState<AvatarConfig | null>('ui-avatar-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.avatar) return null

		config.value = appConfig.avatar
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			if (key === 'maskSrc') {
				cssVariables += `
					--avatar-mask-src: url(${value});
				`
			}
			else {
				cssVariables += `
					--avatar-${useString().camelToKebab(key)}: ${value};
				`
			}
		}
		cssVariables += '}'

		styleElement.innerHTML = cssVariables
		document.head.appendChild(styleElement)

		return true
	}

	return {
		init,
		maskSrc: config.value ? readonly(config.value).maskSrc : '',
	}
}

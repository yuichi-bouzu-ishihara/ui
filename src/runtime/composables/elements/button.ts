/**
 * Button に関する関数をまとめたファイル
 */
import { useUI } from '../ui'
import { useString } from '../string'
import type { UIConfig } from '../../types'
import type { ButtonConfig } from '../../types/button'
import { useAppConfig, useState, readonly } from '#imports'

// Constants ----------------------------------------------------------------------------------------------------------
const DATA_VALUE = 'button'

export const useButton = () => {
	const config = useState<ButtonConfig | null>('buttonConfig', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		// window object がない場合は何もしない
		if (typeof window === 'undefined' || !window.getComputedStyle) {
			throw new Error('Button の初期化に失敗しました。windowオブジェクトが存在しないか、window.getComputedStyleが利用できません。')
		}
		const appConfig = useAppConfig().ui as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.button) return null

		config.value = appConfig.button
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			for (const [prop, propValue] of Object.entries(value)) {
				let cssValue = propValue
				// 'color' 'gradation' が含まれている場合、var(--)で囲む
				if (typeof propValue === 'string' && (propValue.includes('color') || propValue.includes('gradation'))) {
					cssValue = `var(--${propValue})`
				}
				cssVariables += `
					--${DATA_VALUE}-${key}-${useString().camelToKebab(prop)}: ${cssValue};
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
		config: readonly(config),
		primary: config.value ? readonly(config.value).primary : null,
		secondary: config.value ? readonly(config.value).secondary : null,
		tertiary: config.value ? readonly(config.value).tertiary : null,
		quaternary: config.value ? readonly(config.value).quaternary : null,
		link: config.value ? readonly(config.value).link : null,
		info: config.value ? readonly(config.value).info : null,
		minimal: config.value ? readonly(config.value).minimal : null,
		large: config.value ? readonly(config.value).large : null,
		medium: config.value ? readonly(config.value).medium : null,
		small: config.value ? readonly(config.value).small : null,
		xsmall: config.value ? readonly(config.value).xsmall : null,
	}
}

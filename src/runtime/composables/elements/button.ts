/**
 * Button に関する関数をまとめたファイル
 */
import { useCss } from '../css'
import type { UIConfig } from '../../types'
import type { ButtonConfig } from '../../types/button'
import { useAppConfig, useState, readonly } from '#imports'

// Constants ----------------------------------------------------------------------------------------------------------
const DATA_VALUE = 'button'

export const useButton = () => {
	const config = useState<ButtonConfig | null>('ui-button-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.button) return null

		// 設定を更新
		config.value = appConfig.button
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))

		return true
	}

	/**
	 * 設定を更新
	 */
	const update = (conf: ButtonConfig) => {
		config.value = conf
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))
	}

	return {
		init,
		update,
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

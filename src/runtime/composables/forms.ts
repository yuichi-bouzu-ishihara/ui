/**
 * Avatar に関する関数をまとめたファイル
 */
import type { UIConfig } from '../types'
import type { FormsConfig } from '../types/forms'
import { useCss } from './css'
import { useState, useAppConfig, readonly } from '#imports'

// Constants -----------------------------------------
const DATA_VALUE = 'forms'

export const useForms = () => {
	const config = useState<FormsConfig | null>('ui-forms-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.forms) return null

		// 設定を更新
		config.value = appConfig.forms
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))

		return true
	}

	/**
	 * 設定を更新
	 */
	const update = (conf: FormsConfig) => {
		config.value = conf
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))
	}

	return {
		init,
		update,
		config: readonly(config),
	}
}

/**
 * Header に関する関数をまとめたファイル
 */
import { useCss } from '../css'
import type { UIConfig } from '../../types'
import type { HeaderConfig } from '../../types/header'
import { useAppConfig, useState, readonly } from '#imports'

// Constants ----------------------------------------------------------------------------------------------------------
const DATA_VALUE = 'header'

export const useHeader = () => {
	const config = useState<HeaderConfig | null>('ui-header-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.header) return null

		// 設定を更新
		config.value = appConfig.header
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))

		return true
	}

	/**
	 * 設定を更新
	 */
	const update = (conf: HeaderConfig) => {
		config.value = conf
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))
	}

	return {
		init,
		update,
		config: readonly(config),
	}
}

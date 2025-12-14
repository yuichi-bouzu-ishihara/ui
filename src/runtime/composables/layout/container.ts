/**
 * Container に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { ContainerConfig } from '../../types/container'
import { useCss } from '../css'
import { useAppConfig, useState, readonly } from '#imports'

// Constants ----------------------------------------------------------------------------------------------------------
const DATA_VALUE = 'container'

export const useContainer = () => {
	const config = useState<ContainerConfig | null>('ui-container-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.container) return null

		// 設定を更新
		config.value = appConfig.container
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))

		return true
	}

	return {
		init,
		base: config.value ? readonly(config.value).base : null,
		wide: config.value ? readonly(config.value).wide : null,
		narrow: config.value ? readonly(config.value).narrow : null,
		full: config.value ? readonly(config.value).full : null,
		minSideSpace: config.value ? readonly(config.value).base.sideSpace : '',
	}
}

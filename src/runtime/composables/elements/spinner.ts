/**
 * Loader に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { SpinnerConfig } from '../../types/spinner'
import { useState, useAppConfig, readonly } from '#imports'

export const useSpinner = () => {
	const config = useState<SpinnerConfig | null>('spinnerConfig', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as UIConfig ?? {}
		config.value = appConfig.spinner ?? null
	}

	return {
		init,
		size: config.value ? readonly(config.value).size : '',
		stroke: config.value ? readonly(config.value).stroke : '',
		color: config.value ? readonly(config.value).color : '',
	}
}

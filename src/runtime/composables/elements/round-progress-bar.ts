/**
 * Loader に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { RoundProgressBarConfig } from '../../types/round-progress-bar'
import { useState, useAppConfig, readonly } from '#imports'

export const useRoundProgressBar = () => {
	const config = useState<RoundProgressBarConfig | null>('ui-roundProgressBar-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as UIConfig ?? {}
		config.value = appConfig.roundProgressBar ?? null
	}

	return {
		init,
		color: config.value ? readonly(config.value).color : '',
	}
}

/**
 * CircleCheck に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { CircleCheckConfig } from '../../types/circle-check'
import { useState, useAppConfig, readonly } from '#imports'

export const useCircleCheck = () => {
	const config = useState<CircleCheckConfig | null>('ui-circleCheck-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		config.value = appConfig.circleCheck ?? null
	}

	return {
		init,
		size: config.value ? readonly(config.value).size : 48,
		stroke: config.value ? readonly(config.value).stroke : 3,
		color: config.value ? readonly(config.value).color : '',
		duration: config.value ? readonly(config.value).duration : 800,
	}
}

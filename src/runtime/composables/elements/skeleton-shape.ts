/**
 * Loader に関する関数をまとめたファイル
 */
import { useCss } from '../css'
import type { UIConfig } from '../../types'
import type { SkeletonShapeConfig } from '../../types/skeleton-shape'
import { useState, useAppConfig, readonly } from '#imports'

// Constants -----------------------------------------
const DATA_VALUE = 'skeletonShape'

export const useSkeletonShape = () => {
	const config = useState<SkeletonShapeConfig | null>('ui-skeletonShape-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.skeletonShape) return null

		// 設定を更新
		config.value = appConfig.skeletonShape
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))

		return true
	}

	/**
	 * 設定を更新
	 */
	const update = (conf: SkeletonShapeConfig) => {
		config.value = conf
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))
	}

	return {
		init,
		update,
		config: readonly(config),
		blur: config.value ? readonly(config.value).blur : false,
	}
}

/**
 * Avatar に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { AvatarConfig } from '../../types/avatar'
import { useCss } from '../css'
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

		// 設定を更新
		config.value = appConfig.avatar
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))

		return true
	}

	/**
	 * 設定を更新
	 */
	const update = (conf: AvatarConfig) => {
		config.value = conf
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))
	}

	return {
		init,
		update,
		config: readonly(config),
		maskSrc: config.value ? readonly(config.value).maskSrc : '',
	}
}

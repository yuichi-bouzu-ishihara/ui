/**
 * Icon に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { IconConfig } from '../../types/icon'
import { useAppConfig, useState, readonly } from '#imports'

export const useIcon = () => {
	const config = useState<IconConfig | null>('ui-icon-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		config.value = appConfig.icon ?? null
	}

	/**
	 * Icon 参照データを返す
	 */
	const reference = (name: string): string => {
		if (!config.value) return ''
		return `${config.value.dir}/${name}.svg`
	}

	return {
		init,
		reference,
		config: readonly(config),
	}
}

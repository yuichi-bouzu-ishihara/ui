/**
 * DropdownMenu に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { DropdownMenuConfig } from '../../types/dropdown-menu'
import { useCss } from '../css'
import { useState, useAppConfig, readonly } from '#imports'

// Constants -----------------------------------------
const DATA_VALUE = 'dropdownMenu'

export const useDropdownMenu = () => {
	const config = useState<DropdownMenuConfig | null>('ui-dropdownMenu-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.dropdownMenu) return null

		// 設定を更新
		config.value = appConfig.dropdownMenu
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))

		return true
	}

	/**
	 * 設定を更新
	 */
	const update = (conf: DropdownMenuConfig) => {
		config.value = conf
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))
	}

	return {
		init,
		update,
		config: readonly(config),
	}
}

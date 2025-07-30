/**
 * DropdownMenu に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { ToolTipConfig } from '../../types/tool-tip'
import { useCss } from '../css'
import { useState, useAppConfig, readonly } from '#imports'

// Constants -----------------------------------------
const DATA_VALUE = 'toolTip'

export const useToolTip = () => {
	const config = useState<ToolTipConfig | null>('ui-toolTip-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.toolTip) return null

		// 設定を更新
		config.value = appConfig.toolTip
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))

		return true
	}

	/**
	 * 設定を更新
	 */
	const update = (conf: ToolTipConfig) => {
		config.value = conf
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))
	}

	return {
		init,
		update,
		config: readonly(config),
	}
}

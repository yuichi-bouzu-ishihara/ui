/**
 * Icon に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { IconConfig } from '../../types/icon'
import List from '../../assets/bouzu-ui/icons/list.json'
import { useAppConfig, useState, readonly } from '#imports'

// Types -----------------------------------------
type IconReference = {
	class: string
	path: string
}

export const useIcon = () => {
	const config = useState<IconConfig | null>('ui-icon-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as UIConfig ?? {}
		config.value = appConfig.icon ?? null
	}

	/**
	 * Icon 参照データを返す
	 */
	const reference = (name: string): IconReference => {
		const data: IconReference = { class: '', path: '' }
		if (!config.value) return data

		if (List.includes(name)) {
			data.class = `_${name}`
		}
		else {
			if (config.value.dir) {
				data.path = `${config.value.dir}/${name}.svg`
			}
		}
		return data
	}

	return {
		init,
		reference,
		config: readonly(config),
	}
}

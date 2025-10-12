import type { UIConfig } from '../../types'
import type { ToastConfig } from '../../types/toast'
import { useCss } from '../css'
import { readonly, useState, useAppConfig } from '#imports'

// Constants -----------------------------------------
const DATA_VALUE = 'toast'

// Types ---------------------
export type PayloadToast = {
	message: string // メッセージ
	type?: 'text' | 'success' | 'error' | 'warning' | 'info' // タイプ
	icon?: string // アイコン
	duration?: number // 表示時間（ミリ秒）
	persistent?: boolean // 自動消去しないかどうか
	dismissible?: boolean // UIで消去可能かどうか
	image?: {
		src: string // 画像のURL
		processing: boolean // 処理中かどうか
	}
	click?: () => void // クリック時のコールバック
}

export type ToastItem = PayloadToast & {
	id: number
	timer?: number
	persistent?: boolean
	dismissible?: boolean
	image?: {
		src: string
		processing: boolean
	}
	click?: () => void
}

export const useToast = () => {
	const config = useState<ToastConfig | null>('ui-toast-config', () => null)
	const list = useState<ToastItem[]>('ui-toast-list', () => [])
	const nextId = useState<number>('ui-toast-next-id', () => 0)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.toast) return null

		// 設定を更新
		config.value = appConfig.toast
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))

		return true
	}

	/**
	 * 設定を更新
	 */
	const update = (conf: ToastConfig) => {
		config.value = conf
		useCss().setCssVariables(DATA_VALUE, useCss().objectToCssVariables(DATA_VALUE, config.value, ''))
	}

	/**
	 * Toastを表示する
	 * @param {PayloadToast} pl - ペイロード（message, type, icon, duration, persistent, dismissibleを含む）
	 * @returns {number} 生成されたtoastのID
	 */
	const show = (pl: PayloadToast): number => {
		const id = nextId.value++
		const persistent = pl.persistent || false
		const dismissible = pl.dismissible !== false // デフォルトはtrue（消去可能）
		const duration = persistent ? 0 : (pl.duration || 3000)
		let timer: number | undefined
		if (!persistent) {
			timer = window.setTimeout(() => {
				hide(id)
			}, duration)
		}

		list.value.push({
			...pl,
			id,
			type: pl.type || 'text',
			duration,
			persistent,
			dismissible,
			timer,
		})

		return id
	}

	/**
	 * Toastを非表示にする
	 * @param {number} id - 非表示にするtoastのID
	 */
	const hide = (id: number) => {
		clearTimer(id)
		list.value = list.value.filter(t => t.id !== id)
	}

	const clearTimer = (id: number) => {
		const index = list.value.findIndex(t => t.id === id)
		if (index !== -1) {
			const timer = list.value[index].timer
			if (timer) {
				clearTimeout(timer)
			}
		}
	}

	/**
	 * 特定のタイプのtoastを全て非表示にする
	 * @param {string} type - 非表示にするtoastのタイプ
	 */
	const hideByType = (type: string) => {
		list.value.forEach((toast) => {
			if (toast.type === type) {
				clearTimer(toast.id)
			}
		})
		list.value = list.value.filter(t => t.type !== type)
	}

	/**
	 * 全てのtoastを非表示にする
	 */
	const hideAll = () => {
		list.value.forEach((toast) => {
			clearTimer(toast.id)
		})
		list.value = []
	}

	/**
	 * 特定のIDのtoast情報を取得する
	 * @param {number} id - 取得するtoastのID
	 * @returns {ToastItem | undefined} toast情報
	 */
	const getToastById = (id: number) => {
		return list.value.find(t => t.id === id)
	}

	return {
		init,
		update,
		config: readonly(config),
		list: readonly(list),
		show,
		hide,
		hideByType,
		hideAll,
		getToastById,
	}
}

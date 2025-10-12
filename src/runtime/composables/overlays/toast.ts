import { readonly, useState } from '#imports'

// Types ---------------------
export type PayloadToast = {
	message: string // メッセージ
	type?: 'text' | 'success' | 'error' | 'warning' | 'info' // タイプ
	icon?: string // アイコン
	duration?: number // 表示時間（ミリ秒）
	persistent?: boolean // 自動消去しないかどうか
}

export type ToastItem = PayloadToast & {
	id: number
	timer?: number
	persistent?: boolean
}

export const useToast = () => {
	const list = useState<ToastItem[]>('ui-toast-list', () => [])
	const nextId = useState<number>('ui-toast-next-id', () => 0)

	/**
	 * Toastを表示する
	 * @param {PayloadToast} pl - ペイロード
	 * @param {string} message - 表示メッセージ
	 * @param {'text'|'success'|'error'|'warning'|'info'} type - タイプ 'text' | 'success' | 'error' | 'warning' | 'info'
	 * @param {string} icon - アイコン
	 * @param {number} duration - 表示時間（ミリ秒）
	 * @param {boolean} persistent - 自動消去しないかどうか
	 * @returns {number} 生成されたtoastのID
	 */
	const show = (pl: PayloadToast): number => {
		const id = nextId.value++
		const persistent = pl.persistent || false
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
		list: readonly(list),
		show,
		hide,
		hideByType,
		hideAll,
		getToastById,
	}
}

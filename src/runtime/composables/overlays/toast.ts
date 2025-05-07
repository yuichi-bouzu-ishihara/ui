import { readonly, useState } from '#imports'

// Types ---------------------
export type PayloadToast = {
	message: string // メッセージ
	type?: 'text' | 'success' | 'error' | 'warning' | 'info' // タイプ
	icon?: string // アイコン
	duration?: number // 表示時間（ミリ秒）
}

export type ToastItem = PayloadToast & {
	id: number
	timer?: number
}

export const useToast = () => {
	const list = useState<ToastItem[]>('toast', () => [])
	const nextId = useState<number>('toast-next-id', () => 0)

	/**
	 * Toastを表示する
	 * @param {PayloadToast} pl - ペイロード
	 */
	const show = (pl: PayloadToast) => {
		const id = nextId.value++
		const duration = pl.duration || 3000
		const timer = window.setTimeout(() => {
			hide(id)
		}, duration)

		list.value.push({
			...pl,
			id,
			type: pl.type || 'text',
			duration,
			timer,
		})
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

	return {
		list: readonly(list),
		show,
		hide,
	}
}

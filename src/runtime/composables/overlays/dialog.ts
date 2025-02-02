/**
 * 配列に関する関数をまとめたファイル
 */
import { ref } from 'vue'
import type { CustomError } from '../../classes/error'

// Types ---------------------
export interface PayloadAlert {
	title: string // タイトル
	message: string // メッセージ
	icon: string // アイコン
	button?: string // ボタン名
}
export interface PayloadConfirm {
	title: string // タイトル
	message: string // メッセージ
	icon: string // アイコン
	buttons?: {
		ok: string
		cancel: string
	} // ボタン名
}
export interface PayloadError extends CustomError {
	icon?: string // アイコン
}

// Data ---------------------
const type = ref<'alert' | 'confirm' | 'error' | ''>('')
const isOpen = ref(false) // ダイアログが開かれているかどうか
const resolve = ref<((value: unknown) => void) | null>(null) // ダイアログの結果を保持する
const payload = ref<PayloadAlert | PayloadConfirm | PayloadError | null>(null) // ダイアログのペイロードを保持する

export const useDialog = () => {
	return {
		type,
		payload,
		alert,
		confirm,
		error,
		close,
		isOpen,
	}
}

/**
 * アラートを表示する
 * @param {PayloadAlert} pl - ペイロード
 * @returns {Promise<true>} ダイアログの結果、常に true。
 */
const alert = (pl: PayloadAlert): Promise<true> => {
	payload.value = {
		...pl,
		button: pl.button || 'OK',
	}
	type.value = 'alert'
	isOpen.value = true
	return new Promise((rsv) => {
		resolve.value = rsv as (value: unknown) => void
	})
}

/**
 * 確認ダイアログを表示する
 * @param {PayloadConfirm} pl - ペイロード
 * @returns {Promise<boolean>} ダイアログの結果、ok: true, cancel: false
 */
const confirm = (pl: PayloadConfirm): Promise<boolean> => {
	payload.value = {
		...pl,
		buttons: {
			ok: pl.buttons?.ok || 'OK',
			cancel: pl.buttons?.cancel || 'Cancel',
		},
	}
	type.value = 'confirm'
	isOpen.value = true
	return new Promise((rsv) => {
		resolve.value = rsv as (value: unknown) => void
	})
}

/**
 * エラーダイアログを表示する
 * @param {PayloadError} pl - ペイロード
 * @returns {Promise<boolean>} ダイアログの結果、常に true。
 */
const error = (pl: PayloadError): Promise<true> => {
	payload.value = {
		...pl,
		icon: pl.icon || 'exclamation',
		button: pl.button || 'OK',
	}
	type.value = 'error'
	isOpen.value = true
	return new Promise((rsv) => {
		resolve.value = rsv as (value: unknown) => void
	})
}

/**
 * ダイアログを閉じる
 * @param {boolean} result - ダイアログの結果
 */
const close = (result: boolean = true) => {
	isOpen.value = false
	type.value = ''
	payload.value = null
	if (resolve.value) {
		resolve.value(result)
	}
	resolve.value = null
}

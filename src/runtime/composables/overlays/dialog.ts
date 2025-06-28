/**
 * 配列に関する関数をまとめたファイル
 */
import type { CustomError } from '../../classes/error'
import { useState } from '#imports'

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

export const useDialog = () => {
	// State ---------------------
	const type = useState<'alert' | 'confirm' | 'error' | ''>('dialog-type', () => '')
	const isOpen = useState('dialog-isOpen', () => false)
	const resolve = useState<((value: unknown) => void) | null>('dialog-resolve', () => null)
	const payload = useState<PayloadAlert | PayloadConfirm | PayloadError | null>('dialog-payload', () => null)

	// Actions ---------------------
	const setType = (newType: 'alert' | 'confirm' | 'error' | '') => {
		type.value = newType
	}

	const setIsOpen = (value: boolean) => {
		isOpen.value = value
	}

	const setPayload = (newPayload: PayloadAlert | PayloadConfirm | PayloadError | null) => {
		payload.value = newPayload
	}

	const setResolve = (newResolve: ((value: unknown) => void) | null) => {
		resolve.value = newResolve
	}

	/**
	 * アラートを表示する
	 * @param {PayloadAlert} pl - ペイロード
	 * @returns {Promise<true>} ダイアログの結果、常に true。
	 */
	const alert = (pl: PayloadAlert): Promise<true> => {
		setPayload({
			...pl,
			button: pl.button || 'OK',
		})
		setType('alert')
		setIsOpen(true)
		return new Promise((rsv) => {
			setResolve(rsv as (value: unknown) => void)
		})
	}

	/**
	 * 確認ダイアログを表示する
	 * @param {PayloadConfirm} pl - ペイロード
	 * @returns {Promise<boolean>} ダイアログの結果、ok: true, cancel: false
	 */
	const confirm = (pl: PayloadConfirm): Promise<boolean> => {
		setPayload({
			...pl,
			buttons: {
				ok: pl.buttons?.ok || 'OK',
				cancel: pl.buttons?.cancel || 'Cancel',
			},
		})
		setType('confirm')
		setIsOpen(true)
		return new Promise((rsv) => {
			setResolve(rsv as (value: unknown) => void)
		})
	}

	/**
	 * エラーダイアログを表示する
	 * @param {PayloadError} pl - ペイロード
	 * @returns {Promise<boolean>} ダイアログの結果、常に true。
	 */
	const error = (pl: PayloadError): Promise<true> => {
		setPayload({
			...pl,
			icon: pl.icon || 'exclamation',
			button: pl.button || 'OK',
		})
		setType('error')
		setIsOpen(true)
		return new Promise((rsv) => {
			setResolve(rsv as (value: unknown) => void)
		})
	}

	/**
	 * ダイアログを閉じる
	 * @param {boolean} result - ダイアログの結果
	 */
	const close = (result: boolean = true) => {
		setIsOpen(false)
		setType('')
		setPayload(null)
		if (resolve.value) {
			resolve.value(result)
		}
		setResolve(null)
	}

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

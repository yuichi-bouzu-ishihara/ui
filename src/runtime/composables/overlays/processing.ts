/**
 * Processing
 * @note 通信中のローディング画面を表示する
 * @note spinner が true の場合は Spinner を表示する （ percentより優先 ）
 * @note percent が 0 以上の場合は パーセンテージを表示する
 */

import { ref } from 'vue'

// Types ---------------------
interface Payload {
	message?: string // メッセージ
	icon?: string // アイコン
	spinner?: boolean // Spinner 表示
	percent?: number // パーセンテージ
}

// Data ---------------------
const isOpen = ref(false) // レイヤーが開かれているかどうか
const resolve = ref<((value: unknown) => void) | null>(null) // レイヤーの結果を保持する
const payload = ref<Payload | null>(null) // レイヤーのペイロードを保持する
const message = ref<string>('') // メッセージ
const icon = ref<string>('') // アイコン
const spinner = ref<boolean>(false) // 通信中
const percent = ref<number>(0) // パーセンテージ

// レイヤーを操作する関数を返す
export const useProcessing = () => {
	return {
		open,
		update,
		close,
		isOpen,
		message,
		icon,
		spinner,
		percent,
	}
}

/**
 * 指定したレイヤーを表示する
 * @param {Payload} pl - ペイロード
 * @returns {Promise<unknown>} レイヤーの結果
 */
const open = (pl: Payload): Promise<unknown> => {
	payload.value = pl
	isOpen.value = true
	message.value = pl.message ?? ''
	icon.value = pl.icon ?? ''
	spinner.value = pl.spinner ?? false
	percent.value = pl.percent ?? 0
	return new Promise((rsv) => {
		resolve.value = rsv as (value: unknown) => void
	})
}

/**
 * 更新する
 * @param {Payload} pl - 更新するペイロード
 */
const update = (pl: Payload) => {
	message.value = pl.message ?? ''
	icon.value = pl.icon ?? ''
	spinner.value = pl.spinner ?? false
	percent.value = pl.percent ?? 0
}

/**
 * レイヤーを閉じる
 * @param {unknown} result - レイヤーの結果
 */
const close = (result: unknown = true) => {
	isOpen.value = false // vue コンポーネントのトランジション終わりに更新する
	payload.value = null
	message.value = ''
	icon.value = ''
	spinner.value = false
	percent.value = 0
	if (resolve.value) {
		resolve.value(result)
	}
	resolve.value = null
}

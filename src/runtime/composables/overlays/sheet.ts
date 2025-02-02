/**
 * Sheet
 */

import { ref } from 'vue'

// Types ---------------------
export interface Payload {
	name: string // コンポーネント名
	options?: { [key: string]: unknown } | null // オプション
}

// Data ---------------------
const isOpen = ref(false) // シートが開かれているかどうか
const resolve = ref<((value: unknown) => void) | null>(null) // シートの結果を保持する
const payload = ref<Payload | null>(null) // シートのペイロードを保持する
const scrollY = ref(0) // スクロール位置を保持する
const name = ref('') // シートのコンポーネントパスを保持する
const options = ref<unknown | null>(null) // シートのオプションを保持する

// シートを操作する関数を返す
export const useSheet = () => {
	return {
		open,
		close,
		isOpen,
		scrollY,
		name,
		options,
	}
}

/**
 * 指定したシートを表示する
 * @param {Payload} pl - ペイロード
 * @returns {Promise<unknown>} シートの結果
 */
const open = (pl: Payload): Promise<unknown> => {
	payload.value = pl
	isOpen.value = true
	name.value = pl.name
	options.value = pl.options
	return new Promise((rsv) => {
		resolve.value = rsv as (value: unknown) => void
	})
}

/**
 * シートを閉じる
 * @param {unknown} result - シートの結果
 */
const close = (result: unknown = true) => {
	// isOpen.value = false // vue コンポーネントのトランジション終わりに更新する
	payload.value = null
	name.value = ''
	options.value = null
	if (resolve.value) {
		resolve.value(result)
	}
	resolve.value = null
}

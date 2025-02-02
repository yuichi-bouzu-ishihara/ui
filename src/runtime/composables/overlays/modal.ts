/**
 * Modal
 */

import { ref } from 'vue'

// Types ---------------------
interface Payload {
	name: string // 表示名
	backdrop?: '' | 'ultraSoft' | 'soft' | 'medium' | 'hard' | 'solid' // 背景の暗さ
	blur?: boolean // 背景をぼかすかどうか
	options?: { [key: string]: unknown } | null // オプション
}

// Data ---------------------
const isOpen = ref(false) // モーダルが開かれているかどうか
const resolve = ref<((value: unknown) => void) | null>(null) // モーダルの結果を保持する
const payload = ref<Payload | null>(null) // モーダルのペイロードを保持する
const name = ref('') // モーダルのコンポーネントパスを保持する
const backdrop = ref<'' | 'ultraSoft' | 'soft' | 'medium' | 'hard' | 'solid'>('') // 背景の暗さ
const blur = ref(false) // 背景をぼかすかどうか
const options = ref<unknown | null>(null) // モーダルのオプションを保持する

// モーダルを操作する関数を返す
export const useModal = () => {
	return {
		open,
		close,
		isOpen,
		name,
		options,
		backdrop,
		blur,
	}
}

/**
 * 指定したモーダルを表示する
 * @param {Payload} pl - ペイロード
 * @returns {Promise<unknown>} モーダルの結果
 */
const open = (pl: Payload): Promise<unknown> => {
	payload.value = pl
	isOpen.value = true
	name.value = pl.name
	options.value = pl.options
	backdrop.value = pl.backdrop || ''
	blur.value = pl.blur || false
	return new Promise((rsv) => {
		resolve.value = rsv as (value: unknown) => void
	})
}

/**
 * モーダルを閉じる
 * @param {unknown} result - モーダルの結果
 */
const close = (result: unknown = true) => {
	isOpen.value = false
	payload.value = null
	name.value = ''
	options.value = null
	backdrop.value = ''
	blur.value = false
	if (resolve.value) {
		resolve.value(result)
	}
	resolve.value = null
}

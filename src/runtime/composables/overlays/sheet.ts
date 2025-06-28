/**
 * Sheet
 */

import { useState, readonly } from '#imports'

// Types ---------------------
export type Payload = {
	name: string // コンポーネント名
	options?: { [key: string]: unknown } | null // オプション
}
type PayloadWithResolve = Payload & { resolve?: (value: unknown) => void }

// シートを操作する関数を返す
export const useSheet = () => {
	const isOpen = useState<boolean>('ui-sheet-isOpen', () => false) // シートが開かれているかどうか
	const scrollY = useState<number>('ui-sheet-scrollY', () => 0) // スクロール位置を保持する
	const list = useState<PayloadWithResolve[]>('ui-sheet-list', () => []) // シートのリストを保持する

	return {
		/**
		 * 指定したシートを表示する
		 * @param {Payload} pl - ペイロード
		 * @returns {Promise<unknown>} シートの結果
		 */
		open: (pl: Payload): Promise<unknown> => {
			isOpen.value = true
			return new Promise((rsv) => {
				list.value.push({ ...pl, resolve: rsv as (value: unknown) => void })
			})
		},

		/**
		 * シートを閉じる
		 * @param {string | 'all'} name - シートの名前
		 * @param {unknown} result - シートの結果
		 */
		close: async (name: string | 'all', result: unknown = true) => {
			if (name === 'all') {
				list.value = []
			}
			else {
				const pl = list.value.find(item => item.name === name)
				if (pl) {
					if (pl.resolve) {
						pl.resolve(result)
					}
					pl.resolve = undefined
				}
				list.value = list.value.filter(item => item.name !== name)
			}
		},

		/**
		 * name に一致するシートのオプションを取得する
		 * @param {string} name - シートの名前
		 * @returns {unknown | null} シートのオプション
		 */
		getOptions: (name: string) => {
			return list.value.find(item => item.name === name)?.options
		},

		setIsOpen: (value: boolean) => {
			isOpen.value = value
		},
		setScrollY: (y: number) => {
			scrollY.value = y
		},

		isOpen: readonly(isOpen),
		scrollY: readonly(scrollY),
		list: readonly(list),
	}
}

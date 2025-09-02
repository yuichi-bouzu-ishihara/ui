/**
 * Sheet
 */
import { useUI } from '../ui'
import { useCss } from '../css'
import type { UIConfig } from '../../types'
import type { SheetConfig } from '../../types/sheet'
import { useState, useAppConfig, readonly } from '#imports'

// Types ---------------------
export type Payload = {
	name: string // コンポーネント名
	options?: { [key: string]: unknown } | null // オプション
}
type PayloadWithResolve = Payload & { resolve?: (value: unknown) => void }

// Constants -----------------------------------------
const DATA_VALUE = 'sheet'

// シートを操作する関数を返す
export const useSheet = () => {
	const isOpen = useState<boolean>('ui-sheet-isOpen', () => false) // シートが開かれているかどうか
	const scrollY = useState<number>('ui-sheet-scrollY', () => 0) // スクロール位置を保持する
	const list = useState<PayloadWithResolve[]>('ui-sheet-list', () => []) // シートのリストを保持する
	const current = useState<PayloadWithResolve | null>('ui-sheet-current', () => null) // 現在表示中のシートを保持する
	const config = useState<SheetConfig | null>('ui-sheet-config', () => null)

	return {
		/**
		 * 初期化
		 */
		init: () => {
			// window object がない場合は何もしない
			if (typeof window === 'undefined' || !window.getComputedStyle) {
				throw new Error('SkeletonShape の初期化に失敗しました。windowオブジェクトが存在しないか、window.getComputedStyleが利用できません。')
			}

			const appConfig = useAppConfig().ui as UIConfig ?? {}
			// 設定がない場合は何もしない
			if (!appConfig.sheet) return null

			config.value = appConfig.sheet
			const styleElement = document.createElement('style')
			styleElement.setAttribute('type', 'text/css')
			styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

			let cssVariables = ':root {'
			cssVariables += useCss().objectToCssVariables(DATA_VALUE, config.value, '')
			cssVariables += '}'

			styleElement.innerHTML = cssVariables
			document.head.appendChild(styleElement)

			return true
		},

		/**
		 * 指定したシートを表示する
		 * @param {Payload} pl - ペイロード
		 * @returns {Promise<unknown>} シートの結果
		 */
		open: (pl: Payload): Promise<unknown> => {
			isOpen.value = true
			return new Promise((rsv) => {
				current.value = { ...pl, resolve: rsv as (value: unknown) => void }
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
			current.value = null
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
		color: config.value ? readonly(config.value).color : { background: '', text: '' },
		current: readonly(current),
	}
}

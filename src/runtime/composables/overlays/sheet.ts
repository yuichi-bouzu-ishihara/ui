/**
 * Sheet
 */
import { useUI } from '../ui'
import { useCss } from '../css'
import type { UIConfig } from '../../types'
import type { SheetConfig } from '../../types/sheet'
import { useState, useAppConfig, readonly } from '#imports'
import type { Component } from 'vue'

// Types ---------------------
export type Payload = {
	component: Component // コンポーネント型のみ（stringを削除）
	props?: { [key: string]: unknown } | null
}

// 内部保存用（componentは常にstring）
type InternalPayload = {
	index: number // シートのインデックス
	component: string // 内部では常に文字列
	props?: { [key: string]: unknown } | null
	resolve?: (value: unknown) => void
}

// Constants -----------------------------------------
const DATA_VALUE = 'sheet'

// グローバルなコンポーネントマップ（複数のbasicsを統合）
const globalComponentMap = new Map<Component, string>()

// コンポーネント型から名前を取得（Componentのみ受け付ける）
const getComponentName = (component: Component): string => {
	// グローバルマップから検索
	const name = globalComponentMap.get(component)
	if (name) {
		return name
	}

	// フォールバック: Vue 3の__nameプロパティを試す
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if ((component as any).__name) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (component as any).__name
	}

	// 最後のフォールバック: nameプロパティを試す
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if ((component as any).name) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (component as any).name
	}

	// 見つからない場合は空文字を返す（エラーになる可能性がある）
	console.warn('Sheet component name not found. Make sure to register components with setComponents().')
	return ''
}

// シートを操作する関数を返す
export const useSheet = () => {
	const isOpen = useState<boolean>('ui-sheet-isOpen', () => false) // シートが開かれているかどうか
	const scrollY = useState<number>('ui-sheet-scrollY', () => 0) // スクロール位置を保持する
	const list = useState<InternalPayload[]>('ui-sheet-list', () => []) // シートのリストを保持する
	const current = useState<InternalPayload | null>('ui-sheet-current', () => null) // 現在表示中のシートを保持する
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
		 * @param {Payload} pl - ペイロード（componentはコンポーネント型のみ）
		 * @returns {Promise<unknown>} シートの結果
		 */
		open: (pl: Payload): Promise<unknown> => {
			isOpen.value = true
			return new Promise((rsv) => {
				// コンポーネント型から名前を解決（必ず文字列になる）
				const componentName = getComponentName(pl.component)
				const payloadWithResolve: InternalPayload = {
					index: list.value.length, // シートのインデックス - 表示順
					component: componentName, // 文字列
					props: pl.props,
					resolve: rsv as (value: unknown) => void,
				}
				current.value = payloadWithResolve
				list.value.push(payloadWithResolve)
			})
		},

		/**
		 * シートを閉じる
		 * @param {number | 'all'} index - シートのインデックス。'all' の場合はすべて閉じる
		 * @param {unknown} result - シートの結果
		 */
		close: async (index: number | 'all', result: unknown = true) => {
			if (index === 'all') {
				list.value = []
				current.value = null
			}
			else {
				const pl = list.value[index]
				if (pl) {
					if (pl.resolve) {
						pl.resolve(result)
					}
					pl.resolve = undefined
				}
				list.value = list.value.filter((_item, i) => i !== index)
				current.value = list.value[list.value.length - 1] || null
			}
		},

		/**
		 * name に一致するシートのオプションを取得する
		 * @param {string} component - シートの名前
		 * @returns {unknown | null} シートのオプション
		 */
		getProps: (component: string) => {
			return list.value.find(item => item.component === component)?.props
		},

		setIsOpen: (value: boolean) => {
			isOpen.value = value
		},
		setScrollY: (y: number) => {
			scrollY.value = y
		},

		// コンポーネントマップを登録する関数
		setComponents: (components: Record<string, Component>) => {
			Object.entries(components).forEach(([name, component]) => {
				globalComponentMap.set(component, name)
			})
		},

		/**
		 * 指定したインデックスが現在表示中のシートかどうかを判定する
		 * @param {number} index - シートのインデックス
		 * @returns {boolean} 現在表示中のシートかどうか
		 */
		isCurrent: (index: number): boolean => {
			return String(current.value?.index) === String(index)
		},

		isOpen: readonly(isOpen),
		scrollY: readonly(scrollY),
		list: readonly(list),
		color: config.value ? readonly(config.value).color : { background: '', text: '' },
		current: readonly(current),
	}
}

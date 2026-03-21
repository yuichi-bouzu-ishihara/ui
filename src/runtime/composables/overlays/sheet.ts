/**
 * Sheet
 */
import { useUI } from '../ui'
import { useUtils } from '../utils'
import { useCss } from '../css'
import type { UIConfig } from '../../types'
import type { SheetConfig } from '../../types/sheet'
import { useState, useAppConfig, readonly } from '#imports'
import type { Component } from 'vue'

// Types ---------------------
export type Payload = {
	component: Component // コンポーネント型のみ（stringを削除）
	props?: { [key: string]: unknown } | null
	allowDuplicate?: boolean // 重複を許可するかどうか（デフォルト: false）
}

// 内部保存用（componentは常にstring）
type InternalPayload = {
	index: number // シートのインデックス
	component: string // 内部では常に文字列
	props?: { [key: string]: unknown } | null
	resolve?: (value: unknown) => void
	allowDuplicate?: boolean // 重複を許可するかどうか
}

// Constants -----------------------------------------
const DATA_VALUE = 'sheet'
const ANIMATION_DURATION = 250 // シートアニメーション時間（ms）

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

	/**
	 * 指定したインデックスが現在表示中のシートかどうかを判定する
	 * @param {number} index - シートのインデックス
	 * @returns {boolean} 現在表示中のシートかどうか
	 */
	const isCurrent = (index: number): boolean => {
		return String(current.value?.index) === String(index)
	}

	/**
	 * シートを閉じる
	 * @param index - シートのインデックス。'all' の場合はすべて閉じる、number[] の場合は複数同時に閉じる
	 * @param result - シートの結果
	 */
	const close = async (index: number | number[] | 'all', result: unknown = true) => {
		if (index === 'all') {
			list.value = []
			current.value = null
		}
		else if (Array.isArray(index)) {
			// 複数インデックスを同時に閉じる
			const indexSet = new Set(index)
			for (const i of indexSet) {
				const pl = list.value[i]
				if (pl?.resolve) {
					pl.resolve(result)
					pl.resolve = undefined
				}
			}
			list.value = list.value.filter((_item, i) => !indexSet.has(i))
			current.value = list.value[list.value.length - 1] || null
		}
		else {
			const pl = list.value[index]
			if (pl?.resolve) {
				pl.resolve(result)
				pl.resolve = undefined
			}
			list.value = list.value.filter((_item, i) => i !== index)
			current.value = list.value[list.value.length - 1] || null
		}
	}

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
		open: async (pl: Payload): Promise<unknown> => {
			// コンポーネント型から名前を解決（必ず文字列になる）
			const componentName = getComponentName(pl.component)

			// 重複許可の判定:
			// 1. Payload.allowDuplicate が true
			// 2. Payload.props.allowDuplicate が true
			// 3. 既存シートの props.allowDuplicate が true
			// いずれかが true であれば重複を許可する
			const existingItems = list.value.filter(item => item.component === componentName)
			console.log('existingItems', existingItems)
			const allowDuplicate = pl.allowDuplicate ?? true

			// 重複チェック（allowDuplicate が false の場合）
			if (!allowDuplicate && existingItems.length > 0) {
				// 既存のシートをすべて close する
				const indicesToClose = existingItems
					.filter(item => item.index >= 0)
					.map(item => item.index)

				if (indicesToClose.length > 0) {
					await close(indicesToClose)
				}
			}

			isOpen.value = true
			return new Promise((rsv) => {
				const payloadWithResolve: InternalPayload = {
					index: list.value.length, // シートのインデックス - 表示順
					component: componentName, // 文字列
					props: pl.props,
					resolve: rsv as (value: unknown) => void,
					allowDuplicate: pl.allowDuplicate,
				}
				current.value = payloadWithResolve
				list.value.push(payloadWithResolve)
			})
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

		close,
		isCurrent,
		isOpen: readonly(isOpen),
		scrollY: readonly(scrollY),
		list: readonly(list),
		color: config.value ? readonly(config.value).color : { background: '', text: '' },
		current: readonly(current),
	}
}

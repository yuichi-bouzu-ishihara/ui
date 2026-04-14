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
	allowDuplicate?: boolean // 重複を許可するかどうか（デフォルト: false）
}

// 内部保存用（componentは常にstring）
type InternalPayload = {
	index: number // シートのインデックス
	component: string // 内部では常に文字列
	props?: { [key: string]: unknown } | null
	resolve?: (value: unknown) => void
	allowDuplicate?: boolean // 重複を許可するかどうか
	_closeResult?: unknown // close 時の result を保存（reopen用）
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
	const lastClosed = useState<InternalPayload[]>('ui-sheet-lastClosed', () => []) // 直近のcloseで閉じたシート（reopen用）

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
		// 既存の lastClosed の Promise を undefined で resolve（reopen されなかった場合）
		for (const item of lastClosed.value) {
			if (item.resolve) {
				item.resolve(undefined)
				item.resolve = undefined
			}
		}

		let closing: InternalPayload[] = []

		if (index === 'all') {
			closing = [...list.value]
			list.value = []
			current.value = null
		}
		else if (Array.isArray(index)) {
			// 複数インデックスを同時に閉じる（InternalPayload.index プロパティで検索）
			const indexSet = new Set(index)
			closing = list.value.filter(item => indexSet.has(item.index))
			list.value = list.value.filter(item => !indexSet.has(item.index))
			current.value = list.value[list.value.length - 1] || null
		}
		else {
			// 単一インデックスを閉じる（InternalPayload.index プロパティで検索）
			const item = list.value.find(item => item.index === index)
			if (item) closing = [item]
			list.value = list.value.filter(item => item.index !== index)
			current.value = list.value[list.value.length - 1] || null
		}

		// result を保存して lastClosed にセット（resolveは保持したまま）
		lastClosed.value = closing.map(item => ({ ...item, _closeResult: result }))

		// 追加: Promise を resolve する
		closing.forEach(item => item.resolve?.(result))
	}

	/**
	 * 直近のcloseで閉じたシートを再度開く
	 * @returns {boolean} 復元に成功した場合は true
	 */
	const reopen = (): boolean => {
		if (lastClosed.value.length === 0) {
			return false // 復元するシートがない
		}

		// lastClosed のシートを list に戻す
		for (const item of lastClosed.value) {
			// 新しいインデックスを付与（_closeResultは保持したまま）
			const newItem: InternalPayload = { ...item, index: list.value.length }
			list.value.push(newItem)
		}

		// current を更新
		current.value = list.value[list.value.length - 1] || null
		isOpen.value = true

		// lastClosed をクリア
		lastClosed.value = []

		return true
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
				const newIndex = (list.value[list.value.length - 1]?.index ?? 0) + 1
				const payloadWithResolve: InternalPayload = {
					index: newIndex, // シートのインデックス - 表示順
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
		reopen,
		isCurrent,
		isOpen: readonly(isOpen),
		scrollY: readonly(scrollY),
		list: readonly(list),
		lastClosed: readonly(lastClosed),
		color: config.value ? readonly(config.value).color : { background: '', text: '' },
		current: readonly(current),
	}
}

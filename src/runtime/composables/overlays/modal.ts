/**
 * Modal
 */

import { ref } from 'vue'
import type { Component } from 'vue'

// Types ---------------------
export type ModalPayload = {
	component: Component // コンポーネント型のみ
	props?: { [key: string]: unknown } | null
	backdrop?: '' | 'ultraSoft' | 'soft' | 'medium' | 'hard' | 'solid' // 背景の暗さ
	blur?: boolean // 背景をぼかすかどうか
}

// 内部保存用（componentは常にstring）
type InternalPayload = {
	component: string // 内部では常に文字列
	props?: { [key: string]: unknown } | null
	backdrop?: '' | 'ultraSoft' | 'soft' | 'medium' | 'hard' | 'solid'
	blur?: boolean
}

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
	console.warn('Modal component name not found. Make sure to register components with setComponents().')
	return ''
}

// Data ---------------------
const isOpen = ref(false) // モーダルが開かれているかどうか
const resolve = ref<((value: unknown) => void) | null>(null) // モーダルの結果を保持する
const payload = ref<InternalPayload | null>(null) // モーダルのペイロードを保持する
const component = ref('') // モーダルのコンポーネント名を保持する
const backdrop = ref<'' | 'ultraSoft' | 'soft' | 'medium' | 'hard' | 'solid'>('') // 背景の暗さ
const blur = ref(false) // 背景をぼかすかどうか
const props = ref<{ [key: string]: unknown } | null>(null) // モーダルのpropsを保持する

// モーダルを操作する関数を返す
export const useModal = () => {
	return {
		open,
		close,
		setComponents,
		isOpen,
		component,
		props,
		backdrop,
		blur,
	}
}

/**
 * コンポーネントマップを登録する
 * @param {Record<string, Component>} components - コンポーネントマップ
 */
const setComponents = (components: Record<string, Component>) => {
	Object.entries(components).forEach(([name, comp]) => {
		globalComponentMap.set(comp, name)
	})
}

/**
 * 指定したモーダルを表示する
 * @param {ModalPayload} pl - ペイロード
 * @returns {Promise<unknown>} モーダルの結果
 */
const open = (pl: ModalPayload): Promise<unknown> => {
	// コンポーネント型から名前を解決
	const componentName = getComponentName(pl.component)

	const internalPayload: InternalPayload = {
		component: componentName,
		props: pl.props,
		backdrop: pl.backdrop,
		blur: pl.blur,
	}

	payload.value = internalPayload
	isOpen.value = true
	component.value = componentName
	props.value = pl.props || null
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
	component.value = ''
	props.value = null
	backdrop.value = ''
	blur.value = false
	if (resolve.value) {
		resolve.value(result)
	}
	resolve.value = null
}

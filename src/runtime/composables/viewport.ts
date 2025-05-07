/**
 * Viewport に関する関数をまとめたファイル
 */

import { useState, readonly } from '#imports'

export const useViewport = () => {
	const isInitialized = useState('isInitialized', () => false)
	const width = useState('width', () => 0)
	const height = useState('height', () => 0)
	const initWidth = useState('initWidth', () => 0) // 初期の横幅
	const initHeight = useState('initHeight', () => 0) // 初期の縦幅
	const keyboardHeight = useState('keyboardHeight', () => 0) // ソフトウェアキーボードの高さ

	/**
	 * 初期化
	 */
	const init = () => {
		if (isInitialized.value || typeof window === 'undefined' || !window.getComputedStyle) return

		// 初期化済みなら何もしない
		if (isInitialized.value) return

		// 初期のviewportサイズを設定
		initWidth.value = window.visualViewport?.width || window.innerWidth
		initHeight.value = window.visualViewport?.height || window.innerHeight

		// 現在のviewportサイズを設定
		update()
		// resizeイベントリスナーを追加
		if (window.visualViewport) {
			window.visualViewport.addEventListener('resize', update)
		}
		else {
			window.addEventListener('resize', update)
		}

		// 初期化済みフラグをセット
		isInitialized.value = true
	}

	/**
	 * 更新
	 */
	const update = () => {
		width.value = window.visualViewport?.width || window.innerWidth
		height.value = window.visualViewport?.height || window.innerHeight
		keyboardHeight.value = window.innerHeight - height.value
	}

	return {
		init,
		width: readonly(width),
		height: readonly(height),
		initWidth: readonly(initWidth),
		initHeight: readonly(initHeight),
		keyboardHeight: readonly(keyboardHeight),
	}
}

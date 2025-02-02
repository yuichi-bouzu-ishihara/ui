/**
 * Viewport に関する関数をまとめたファイル
 */

import { ref } from 'vue'
// 初期化フラグ
const isInitialized = ref<boolean>(false)

// 変数
const width = ref(0)
const height = ref(0)
const initWidth = ref(0) // 初期の横幅
const initHeight = ref(0) // 初期の縦幅
const keyboardHeight = ref(0) // ソフトウェアキーボードの高さ

export const useViewport = () => {
	return {
		init,
		width,
		height,
		initWidth,
		initHeight,
		keyboardHeight,
	}
}

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

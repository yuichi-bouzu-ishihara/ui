/**
 * @brief bodyのスクロールを監視するストア
 */

import { ref } from 'vue'

const initFlag = ref(false) // 初期化済みフラグ
const scrollY = ref(0) // 現在のスクロール位置
const isScrollingUp = ref(false) // 上方向にスクロールしているか
const isScrollingDown = ref(false) // 下方向にスクロールしているか
const lastScrollY = ref(0) // 前回のスクロール位置
const isScrollLock = ref(false) // bodyのスクロールロック

export const useScroll = () => {
	return {
		scrollY,
		isScrollingUp,
		isScrollingDown,
		isScrollLock,
		lastScrollY,
		init,
		setScrollY,
		lock,
		unlock,
	}
}

/**
 * 初期化処理
 */
const init = () => {
	// 初期化済み、または window オブジェクトがなければ、何もしない
	if (initFlag.value || typeof window === 'undefined') return
	initFlag.value = true

	window.addEventListener('scroll', () => {
		scrollY.value = window.scrollY

		if (scrollY.value > lastScrollY.value) {
			isScrollingDown.value = true
			isScrollingUp.value = false
		}
		else if (scrollY.value < lastScrollY.value) {
			isScrollingDown.value = false
			isScrollingUp.value = true
		}

		lastScrollY.value = scrollY.value
	})
}

/**
 * スクロール位置を指定する
 */
const setScrollY = (y: number) => {
	window.scrollTo(0, y)
}

/**
 * body のスクロールをロックする
 */
const lock = () => {
	isScrollLock.value = true
	document.body.classList.toggle('_scrollLock', true)
}

/**
 * body のスクロールを解除する
 */
const unlock = () => {
	isScrollLock.value = false
	document.body.classList.toggle('_scrollLock', false)
}

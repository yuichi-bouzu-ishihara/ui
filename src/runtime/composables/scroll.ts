/**
 * @brief bodyのスクロールを監視するストア
 */

import { useState, readonly } from '#imports'

export const useScroll = () => {
	// State
	const initFlag = useState<boolean>('ui-scroll-initFlag', () => false) // 初期化済みフラグ
	const scrollY = useState<number>('ui-scroll-scrollY', () => 0) // 現在のスクロール位置
	const isScrollingUp = useState<boolean>('ui-scroll-isScrollingUp', () => false) // 上方向にスクロールしているか
	const isScrollingDown = useState<boolean>('ui-scroll-isScrollingDown', () => false) // 下方向にスクロールしているか
	const lastScrollY = useState<number>('ui-scroll-lastScrollY', () => 0) // 前回のスクロール位置
	const isScrollLock = useState<boolean>('ui-scroll-isScrollLock', () => false) // bodyのスクロールロック

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

	return {
		scrollY: readonly(scrollY),
		isScrollingUp: readonly(isScrollingUp),
		isScrollingDown: readonly(isScrollingDown),
		isScrollLock: readonly(isScrollLock),
		lastScrollY: readonly(lastScrollY),
		init,
		setScrollY,
		lock,
		unlock,
	}
}

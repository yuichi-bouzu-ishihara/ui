/**
 * 要素のサイズ変更を検知して、ディレクティブに渡された値（コールバック関数）を呼び出す
 */

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('resize', {
		// 要素が DOM に挿入されたときに呼ばれる
		mounted(el, binding) {
			const observer = new ResizeObserver((entries) => {
				// コールバック関数でサイズ変更を検知
				for (let entry of entries) {
					// binding.value はディレクティブに渡された値（ここではコールバック関数）
					if (typeof binding.value === 'function') {
						binding.value(entry.target.getBoundingClientRect())
					}
				}
			})
			// 監視を開始
			observer.observe(el)

			// 後で監視を停止できるように、要素に observer を保存
			el.__resizeObserver__ = observer
		},
		// コンポーネントやディレクティブがアンマウントされたときに呼ばれる
		unmounted(el) {
			// 監視を停止
			if (el.__resizeObserver__) {
				el.__resizeObserver__.disconnect()
				delete el.__resizeObserver__
			}
		},
	})
})

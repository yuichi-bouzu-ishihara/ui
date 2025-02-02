/**
 * クリックイベントを検知して、要素の外側をクリックしたときに、ディレクティブに渡された値（コールバック関数）を呼び出す
 */

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('click-outside', {
		// 要素が DOM に挿入されたときに呼ばれる
		mounted(el, binding) {
			// クリックイベントを処理する関数
			el.handleOutsideClick = (event) => {
				// クリックされた要素が el でない、かつ el の子要素でもない場合
				if (!(el === event.target || el.contains(event.target))) {
					// binding.value はディレクティブに渡された値（ここではコールバック関数）
					if (typeof binding.value === 'function') {
						binding.value(event)
					}
				}
			}
			// ドキュメント全体にクリックイベントリスナーを追加
			document.addEventListener('click', el.handleOutsideClick)
		},
		// コンポーネントやディレクティブがアンマウントされたときに呼ばれる
		unmounted(el) {
			// イベントリスナーを削除
			document.removeEventListener('click', el.handleOutsideClick)
		},
	})
})

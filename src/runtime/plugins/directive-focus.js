/**
 * ディレクティブが適用された要素が DOM に挿入されたときに、デフォルトでフォーカスを設定する
 * バインディングの値が true の場合のみフォーカスを設定する
 */

import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('focus', {
		// 要素が DOM に挿入されたときに呼ばれる
		mounted(el, binding) {
			// デフォルトでフォーカスを設定
			if (binding.value === undefined || binding.value) {
				el.focus()
			}
		},
		// 更新時に呼ばれる（バインディングの値が変更された場合）
		updated(el, binding) {
			// バインディングの値が true の場合のみフォーカスを設定
			if (binding.value) {
				el.focus()
			}
		},
	})
})

// カスタムディレクティブ 'v-intersect' の定義
/**
 * カスタムディレクティブ 'v-intersect'
 * @description IntersectionObserver を利用して要素の表示状態を監視する。
 * @note v-intersect を設定したコンポーネントが表示されたときにイベントを発火する。
 * @note v-intersect="{ threshold: 0.5 }" - 50%以上表示されたときにイベントを発火する。
 * @note v-intersect.once - 一度だけイベントを発火する。
 * @note v-intersect.each - 要素が 「表示・非表示されるたび」 にイベントを発火する。
 * @note v-intersect.out - 要素が 「表示されてから非表示になるたび」 にイベントを発火する。
 * @note v-intersect.in - 要素が 「表示になるたび」 にイベントを発火する。
 * @note v-on:intersect - イベントが発火する。
 */

import { defineNuxtPlugin } from '#app'

// イベント発火関数
const emitIntersectEvent = (vnode, entry) => {
	const handlers = vnode.props['onIntersect']
	if (handlers) {
		if (Array.isArray(handlers)) {
			handlers.forEach(handler => handler(entry))
		}
		else {
			handlers(entry)
		}
	}
}

// 監視解除関数
const disconnect = (el) => {
	const id = el.dataset.intersectionObserverId
	if (observers[id]) {
		observers[id].disconnect()
		delete observers[id]
	}
	delete el.dataset.intersectionObserverId
}

// IntersectionObserverインスタンスの管理オブジェクト
const observers = {}
let currentId = 0

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('intersect', {
		mounted(el, binding, vnode) {
			const { once, each, out, in: inModifier } = binding.modifiers // 'in' モディファイアを追加
			const observerOptions = typeof binding.value === 'object' ? binding.value : {}

			const isFiring = (entry) => {
				if (each) return true
				if (out) return !entry.isIntersecting
				if (inModifier) return entry.isIntersecting // 'in' モディファイアが true の場合
				return entry.isIntersecting
			}

			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (isFiring(entry)) {
						emitIntersectEvent(vnode, entry)
						if (once) {
							disconnect(el)
						}
					}
				})
			}, observerOptions)

			const id = String(currentId++)
			observers[id] = observer
			el.dataset.intersectionObserverId = id

			observer.observe(el)
		},
		unmounted(el) {
			disconnect(el)
		},
	})
})

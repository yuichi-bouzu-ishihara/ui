/**
 * @brief ルート情報を監視する
 * @description 前の route と現在の route を保持します。
 */

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import type { UIConfig } from '../types'
import { useScroll } from './scroll'
import { useObject } from './object'
import { useAppConfig } from '#imports'

const initFlag = ref(false) // 初期化済みフラグ
const to = ref({}) // 現在の route
const from = ref({}) // 前の route
const scrollPositions = ref({} as Record<string, number>) // スクロール位置を保存します

export const useRouteTracker = () => {
	return {
		to: computed(() => to.value) as unknown as RouteLocationNormalized,
		from: computed(() => from.value) as unknown as RouteLocationNormalized,
		init,
		getScrollPosition,
		isPrevRoute,
	}
}

/**
 * 初期化処理
 */
const init = async () => {
	const appConfig = useAppConfig().ui as UIConfig ?? {}
	if (appConfig.routeTracker?.disabled) return

	// 既に初期化済みであれば何もしない
	if (initFlag.value) return

	initFlag.value = true
	useRouter().beforeEach((t, f, next) => {
		// 現在のルートのスクロール位置を保存する
		scrollPositions.value[f.fullPath] = Number(useScroll().scrollY)
		to.value = t
		from.value = f
		next()
	})
}

/**
 * 指定したパスのスクロール位置を取得します。
 */
const getScrollPosition = (path: string) => {
	return scrollPositions.value[path] || 0
}

/**
 * 前のページ URL があるかどうか
 * @returns {boolean} 前のページ URL がある場合はtrue、ない場合はfalse
 */
const isPrevRoute = () => {
	let flag = false
	if (from.value) {
		if (useObject().isEmpty(from.value)) {
			flag = false
		}
		else {
			flag = true
		}
	}
	return flag
}

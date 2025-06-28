/**
 * @brief ルート情報を監視する
 * @description 前の route と現在の route を保持します。
 */

import { useRouter } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import type { UIConfig } from '../types'
import { useScroll } from './scroll'
import { useObject } from './object'
import { useState, readonly, useAppConfig } from '#imports'

export const useRouteTracker = () => {
	// State
	const initFlag = useState<boolean>('ui-route-tracker-initFlag', () => false) // 初期化済みフラグ
	const to = useState<RouteLocationNormalized>('ui-route-tracker-to', () => ({} as RouteLocationNormalized)) // 現在の route
	const from = useState<RouteLocationNormalized>('ui-route-tracker-from', () => ({} as RouteLocationNormalized)) // 前の route
	const scrollPositions = useState<Record<string, number>>('ui-route-tracker-scrollPositions', () => ({})) // スクロール位置を保存します

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

	return {
		to: readonly(to),
		from: readonly(from),
		init,
		getScrollPosition,
		isPrevRoute,
	}
}

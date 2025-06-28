/**
 * @brief ルート情報を監視する
 * @description 前の route と現在の route を保持します。
 */

import { useRouter } from 'vue-router'
import type { UIConfig } from '../types'
import { useScroll } from './scroll'
import { useObject } from './object'
import { useState, readonly, useAppConfig } from '#imports'

// シンプルな型定義で型エラーを回避
interface SimpleRoute {
	fullPath: string
	path: string
	name?: string
	params: Record<string, string>
	query: Record<string, string>
}

export const useRouteTracker = () => {
	// State
	const initFlag = useState<boolean>('ui-route-tracker-initFlag', () => false) // 初期化済みフラグ
	const to = useState<SimpleRoute>('ui-route-tracker-to', () => ({ fullPath: '', path: '', params: {}, query: {} })) // 現在の route
	const from = useState<SimpleRoute>('ui-route-tracker-from', () => ({ fullPath: '', path: '', params: {}, query: {} })) // 前の route
	const scrollPositions = useState<Record<string, number>>('ui-route-tracker-scrollPositions', () => ({})) // スクロール位置を保存します

	/**
	 * 初期化処理
	 */
	const init = async () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		if (appConfig.routeTracker?.disabled) return

		// 既に初期化済みであれば何もしない
		if (initFlag.value) return

		initFlag.value = true
		useRouter().beforeEach((t, f, next) => {
			// 現在のルートのスクロール位置を保存する
			scrollPositions.value[f.fullPath] = Number(useScroll().scrollY)

			// シンプルな型に変換
			to.value = {
				fullPath: t.fullPath,
				path: t.path,
				name: t.name as string | undefined,
				params: t.params as Record<string, string>,
				query: t.query as Record<string, string>,
			}
			from.value = {
				fullPath: f.fullPath,
				path: f.path,
				name: f.name as string | undefined,
				params: f.params as Record<string, string>,
				query: f.query as Record<string, string>,
			}
			next()
		})
	}

	/**
	 * 指定したパスのスクロール位置を取得します。
	 */
	const getScrollPosition = (path: string): number => {
		return scrollPositions.value[path] || 0
	}

	/**
	 * 前のページ URL があるかどうか
	 * @returns {boolean} 前のページ URL がある場合はtrue、ない場合はfalse
	 */
	const isPrevRoute = (): boolean => {
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

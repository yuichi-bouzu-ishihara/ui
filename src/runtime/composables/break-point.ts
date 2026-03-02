/**
 * Break Point に関する関数をまとめたファイル
 */

import type { UIConfig } from '../types'
import type { BreakPointConfig } from '../types/break-point'
import { useUI } from './ui'
import { useString } from './string'
import { useViewport } from './viewport'
import { reactive, useState, useAppConfig, readonly, watch } from '#imports'

// Constants ------------------------------------------------------------------------------------------------------------
const DATA_VALUE = 'breakPoint'
const SCREEN_SIZE_VARS = ['xxl', 'xl', 'l', 'm', 's', 'xs'] // 画面サイズの変数名を大きい順に並べる
const MEDIA_FEATURE_QUERY = 'min-width' // メディアクエリのキー。 サイズ以上で統一。

export const useBreakPoint = () => {
	// キャッシュを格納するための Map
	const queryCache: Map<string, { matches: ReturnType<typeof useState<boolean>>, mql: MediaQueryList }> = new Map()

	const results = reactive({} as Record<string, ReturnType<typeof useState<boolean>>>)
	const mqls = [] as { mql: MediaQueryList, matches: ReturnType<typeof useState<boolean>>, screenSize: string }[]

	// useState
	const config = useState<BreakPointConfig | null>('ui-breakPoint-config', () => null)
	const isInitialized = useState<boolean>('ui-breakPoint-isInitialized', () => false)
	const isViewportWatchInitialized = useState<boolean>('ui-breakPoint-isViewportWatchInitialized', () => false)
	const currentScreenSize = useState<string>('ui-breakPoint-currentScreenSize', () => '')

	/**
	 * 初期化
	 */
	const init = () => {
		// 既に初期化済みなら何もしない
		if (isInitialized.value) return

		// window object がない場合は何もしない
		if (typeof window === 'undefined' || !window.getComputedStyle) {
			throw new Error('Typography の初期化に失敗しました。windowオブジェクトが存在しないか、window.getComputedStyleが利用できません。')
		}

		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.breakPoint) return

		config.value = appConfig.breakPoint
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			cssVariables += `
					--${useString().camelToKebab(DATA_VALUE)}-${useString().camelToKebab(key)}: ${value};
				`
		}
		cssVariables += '}'

		styleElement.innerHTML = cssVariables
		document.head.appendChild(styleElement)

		const createMediaQuery = (query: string) => {
			let result = queryCache.get(query)
			if (!result) {
				const mql = window.matchMedia(query)
				const matches = useState(`ui-breakPoint-matches-${query}`, () => mql.matches)
				result = { matches, mql }
				queryCache.set(query, result)
			}
			return result
		}

		// 初期化フェーズでmatchedSizes配列を作成
		const matchedSizes: string[] = []

		for (const cssVar of SCREEN_SIZE_VARS) {
			const value = config.value[cssVar as keyof BreakPointConfig]
			const result = createMediaQuery(`(${MEDIA_FEATURE_QUERY}: ${value})`)

			// 結果をリアクティブオブジェクトに追加
			results[`screen${cssVar.toUpperCase()}`] = result.matches

			// 詳細を配列に追加
			mqls.push({ ...result, screenSize: cssVar })

			// マッチした場合、配列に追加
			if (result.matches.value) {
				matchedSizes.push(cssVar)
			}
		}

		mqls.forEach(({ mql, screenSize }: { mql: MediaQueryList, screenSize: string }) => {
			mql.addEventListener('change', (e: MediaQueryListEvent) => {
				// console.log('change', e)
				if (e.matches) {
					// サイズがマッチした場合、配列に追加
					matchedSizes.push(screenSize)
				}
				else {
					// サイズがマッチしなくなった場合、配列から削除
					const index = matchedSizes.indexOf(screenSize)
					if (index > -1) {
						matchedSizes.splice(index, 1)
					}
				}

				// 最大の画面サイズを現在の画面サイズとして設定
				currentScreenSize.value = getMaximumScreenSize(matchedSizes)
			})
		})

		// 与えられた画面サイズの配列から最も大きいものを取得する関数
		const getMaximumScreenSize = (sizes: string[]): string => {
			const orderedScreenSizes = [...SCREEN_SIZE_VARS].reverse()
			let maxIndex = -1
			let maxSize = ''

			for (const size of sizes) {
				const index = orderedScreenSizes.indexOf(size)
				if (index > maxIndex) {
					maxIndex = index
					maxSize = size
				}
			}

			// マッチする画面サイズがない場合、最小の値をデフォルトとして返す
			return maxSize || SCREEN_SIZE_VARS[SCREEN_SIZE_VARS.length - 1]
		}

		// 初期値を設定（最大の画面サイズを設定）
		currentScreenSize.value = getMaximumScreenSize(matchedSizes)

		// 初期化済みフラグをセット
		isInitialized.value = true

		// viewport.width の watch を設定（フォールバック機構）
		initViewportWatch()
	}

	/**
	 * viewport.width（数値px）から該当するブレークポイントを判定する関数
	 * @param width ビューポート幅（px）
	 * @returns 現在のスクリーンサイズ（'xxl', 'xl', 'l', 'm', 's', 'xs'）
	 */
	const getScreenSizeFromWidth = (width: number): string => {
		if (!config.value) return SCREEN_SIZE_VARS[SCREEN_SIZE_VARS.length - 1]

		// SCREEN_SIZE_VARS は大きい順: ['xxl', 'xl', 'l', 'm', 's', 'xs']
		for (const size of SCREEN_SIZE_VARS) {
			const breakpointValue = config.value[size as keyof BreakPointConfig]
			if (typeof breakpointValue !== 'string') continue
			const breakpointPx = Number.parseInt(breakpointValue, 10)
			if (width >= breakpointPx) {
				return size
			}
		}
		return SCREEN_SIZE_VARS[SCREEN_SIZE_VARS.length - 1] // 'xs'
	}

	/**
	 * viewport.width を watch して currentScreenSize を更新する（フォールバック機構）
	 * MediaQueryList の change イベントが発火しない場合の補完として機能
	 */
	const initViewportWatch = () => {
		// 既に初期化済みなら何もしない
		if (isViewportWatchInitialized.value) return

		const viewport = useViewport()

		watch(
			() => viewport.width.value,
			(newWidth) => {
				if (newWidth > 0 && config.value) {
					const newSize = getScreenSizeFromWidth(newWidth)
					// 値が変わった場合のみ更新（競合回避）
					if (currentScreenSize.value !== newSize) {
						currentScreenSize.value = newSize
					}
				}
			},
			{ immediate: false },
		)

		isViewportWatchInitialized.value = true
	}

	const above = (size: string): boolean => {
		const orderedScreenSizes = [...SCREEN_SIZE_VARS].reverse()
		const idxCurrent = orderedScreenSizes.indexOf(currentScreenSize.value)
		const idxSize = orderedScreenSizes.indexOf(size)
		return idxCurrent >= idxSize
	}

	const below = (size: string): boolean => {
		const orderedScreenSizes = [...SCREEN_SIZE_VARS].reverse()
		const idxCurrent = orderedScreenSizes.indexOf(currentScreenSize.value)
		const idxSize = orderedScreenSizes.indexOf(size)
		return idxCurrent <= idxSize
	}

	const baseAbove = (): boolean => {
		return above(config.value?.base || 'm')
	}

	return {
		init,
		above,
		below,
		baseAbove,
		currentScreenSize: readonly(currentScreenSize),
		config: readonly(config),
	}
}

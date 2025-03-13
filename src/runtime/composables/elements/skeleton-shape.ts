/**
 * Loader に関する関数をまとめたファイル
 */
import { useUI } from '../ui'
import type { UIConfig } from '../../types'
import type { SkeletonShapeConfig } from '../../types/skeleton-shape'
import { useState, useAppConfig, readonly } from '#imports'

// Constants -----------------------------------------
const DATA_VALUE = 'skeletonShape'

export const useSkeletonShape = () => {
	const config = useState<SkeletonShapeConfig | null>('skeletonShapeConfig', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		// window object がない場合は何もしない
		if (typeof window === 'undefined' || !window.getComputedStyle) {
			throw new Error('SkeletonShape の初期化に失敗しました。windowオブジェクトが存在しないか、window.getComputedStyleが利用できません。')
		}

		const appConfig = useAppConfig().ui as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.skeletonShape) return null

		config.value = appConfig.skeletonShape
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			if (key === 'color') {
				cssVariables += `
					--skeleton-shape-color: var(--${value});
				`
			}
			else if (key === 'animationTo') {
				cssVariables += `
					--skeleton-shape-animation-to: var(--${value});
				`
			}
			else {
				cssVariables += `
					--skeleton-shape-${key}: ${value};
				`
			}
		}
		cssVariables += '}'

		styleElement.innerHTML = cssVariables
		document.head.appendChild(styleElement)

		return true
	}

	return {
		init,
		config: readonly(config),
		blur: config.value ? readonly(config.value).blur : false,
	}
}

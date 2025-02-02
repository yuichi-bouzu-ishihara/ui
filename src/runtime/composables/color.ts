/**
 * Color に関する関数をまとめたファイル
 */
import type { UIConfig } from '../types'
import type { ColorConfig } from '../types/color'
import { useAppConfig, useState, readonly } from '#imports'

/**
 * 透明度のステップ
 * _variables.scss で定義しているものと同じにすること。
 * @see ../scss/_variables.scss
 */
const OPACITY_STEPS = [0.00, 0.03, 0.05, 0.07, 0.10, 0.15, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00]

export const useColor = () => {
	const config = useState<ColorConfig | null>('colorConfig', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		// window object がない場合は何もしない
		if (typeof window === 'undefined' || !window.getComputedStyle) {
			throw new Error('Typography の初期化に失敗しました。windowオブジェクトが存在しないか、window.getComputedStyleが利用できません。')
		}

		const appConfig = useAppConfig().ui as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.color) return

		config.value = appConfig.color
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')

		let cssVariables = ':root {'
		for (const [key, value] of Object.entries(config.value)) {
			const rgb = hexToRgb(value as string)
			cssVariables += `
			--color-${key}: ${value};
		`
			for (const opacity of OPACITY_STEPS) {
				if (!rgb) continue
				cssVariables += `
					--color-${key}-${Math.round(opacity * 100).toString().padStart(3, '0')}: rgb(${rgb.r} ${rgb.g} ${rgb.b} / ${opacity * 100}%);
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
		opacitySteps: readonly(OPACITY_STEPS),
	}
}

/**
 * 16進数をRGBに変換する
 */
const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
	// 先頭の#を削除
	const sanitizedHex = hex.replace(/^#/, '')

	// 3桁の16進数を6桁に変換
	const fullHex = sanitizedHex.length === 3
		? sanitizedHex.split('').map(char => char + char).join('')
		: sanitizedHex

	// 16進数が正しいかどうかを確認
	if (fullHex.length !== 6) {
		return null
	}

	// RGB値に変換
	const r = Number.parseInt(fullHex.substring(0, 2), 16)
	const g = Number.parseInt(fullHex.substring(2, 4), 16)
	const b = Number.parseInt(fullHex.substring(4, 6), 16)

	return { r, g, b }
}

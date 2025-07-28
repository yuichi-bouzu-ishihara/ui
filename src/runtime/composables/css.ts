/**
 * CSS に関する関数をまとめたファイル
 */
import { useUI } from './ui'
import { useMode } from './mode'
import { useString } from './string'

// 定数
const BASE_VIEWPORT = 1080 // ベースとなるビューポート値

export const useCss = () => {
	// オブジェクトを再帰的に処理してCSS変数に変換する関数
	const setCssVariables = (dataValue: string, variables: string): void => {
		// window object がない場合は何もしない
		if (typeof window === 'undefined' || !window.getComputedStyle) {
			throw new Error('CSS 変数の設定に失敗しました。windowオブジェクトが存在しないか、window.getComputedStyleが利用できません。')
		}

		// 既存の color 変数用のstyle要素を探す
		const existingStyle = document.querySelector(`style[data-${useUI().dataKey}="${dataValue}"]`)
		if (existingStyle) {
			existingStyle.remove()
		}
		// 新しい style 要素を作成
		const styleElement = document.createElement('style')
		styleElement.setAttribute('type', 'text/css')
		styleElement.setAttribute(`data-${useUI().dataKey}`, dataValue)
		styleElement.innerHTML = `:root {${variables}}`
		document.head.appendChild(styleElement)
	}

	// オブジェクトを再帰的に処理してCSS変数に変換する関数
	const objectToCssVariables = (dataValue: string, obj: Record<string, unknown>, prefix: string): string => {
		let cssVariables = ''

		for (const [key, value] of Object.entries(obj)) {
			const kebabKey = useString().camelToKebab(key)
			const currentPrefix = prefix ? `${prefix}-${kebabKey}` : kebabKey

			if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				// ネストしたオブジェクトの場合は再帰的に処理
				cssVariables += objectToCssVariables(dataValue, value as Record<string, unknown>, currentPrefix)
			}
			else {
				// プリミティブ値の場合はCSS変数として追加
				let cssValue = value
				// 'color' 'gradation' が含まれている場合、var(--)で囲む
				if (typeof value === 'string' && (value.includes('color') || value.includes('gradation'))) {
					cssValue = `var(--${value})`
				}
				cssVariables += `
				--${useString().camelToKebab(dataValue)}-${currentPrefix}: ${cssValue};
			`
			}
		}

		return cssVariables
	}

	return {
		getVariable,
		getVwByPx,
		getPxByVw,
		getMaxPxVw,
		getSize: (px: number, absolute: boolean = useMode().sizeType.value === 'px', viewport: number = BASE_VIEWPORT) => getSize(px, absolute, viewport),
		setCssVariables,
		objectToCssVariables,
	}
}

/**
 * CSS 変数を取得する
 * @param {keyof typeof variables.value} type - 変数のタイプ
 * @param {string} [key] - 変数のキー
 * @returns {string} 変数の値
 */
const getVariable = (type: string, key?: string) => {
	if (typeof window === 'undefined' || !window.getComputedStyle) return null

	const computedStyle = getComputedStyle(document.documentElement)
	let variableValue: string | number | null = null

	switch (type) {
		case 'fontFamily':
			variableValue = computedStyle.getPropertyValue(`--font-family-${key}`)
			break
		case 'fontJaSizeAdjust':
			variableValue = Number(computedStyle.getPropertyValue('--font-ja-size-adjust')) || 1
			break
		case 'color':
			if (key) {
				variableValue = computedStyle.getPropertyValue(`--color-${key}`)
			}
			break
		case 'maxWidth':
			if (key) {
				variableValue = Number(computedStyle.getPropertyValue(`--max-width-${key}`))
			}
			break
		default:
			break
	}

	return variableValue
}

/**
 * px を vw に変換する関数
 * @param {number} px 変換する px
 * @param {number} viewport ビューポートの値
 * @returns {number} vw に変換された値
 */
const getVwByPx = (px: number, viewport: number = BASE_VIEWPORT): number => {
	const vp = viewport > 0 ? viewport : BASE_VIEWPORT
	return (100 / vp) * px
}

/**
 * vw を px に変換して返す
 * @param {number} vw px に変換したい vw の値。
 * @param {number} viewport 変換するビューポート px の値。
 * @return {number} 変換後の px の値。
 */
const getPxByVw = (vw: number, viewport: number = BASE_VIEWPORT): number => {
	const vp = viewport > 0 ? viewport : BASE_VIEWPORT
	return vw / (100 / vp)
}

/**
 * vw を計算して、max 関数でラップして返す。
 * @param {number} px - 変換する px
 * @param {number} [viewport] - ビューポートの値
 * @returns {string} css文字列
 *
 * 以下 scss の javascript での実装
 * @see /src/assets/scss/global/_functions.scss
 */
const getMaxPxVw = (px: number, viewport: number = BASE_VIEWPORT): string => {
	let v: string = 'auto'
	// 0 は max(0,0) と返すと無効になってしまうので回避する。
	if (px === 0) {
		v = '0'
	}
	else if (px < 0) {
		v = `calc(-1 * ${getVwByPx(px, viewport)}vw, -1 * ${px}px)`
	}
	else {
		v = `max(${getVwByPx(px, viewport)}vw, ${px}px)`
	}
	return v
}

/**
 * px 数値でサイズを指定し、絶対値かどうかで vw に変換して返す。
 * @param {number} px - 変換する px
 * @param {boolean} [absolute] - 絶対値指定フラグ。
 * @param {number} [viewport] - ビューポートの値
 * @returns {string} css文字列
 *
 * 以下 scss の javascript での実装
 * @see /src/assets/scss/global/_functions.scss
 */
const getSize = (px: number, absolute: boolean, viewport: number = BASE_VIEWPORT): string => {
	let v: string = 'auto'
	if (absolute) {
		v = `${px}px`
	}
	else {
		v = `${getMaxPxVw(px, viewport)}`
	}
	return v
}

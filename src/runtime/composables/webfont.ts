/**
 * Web Font に関する関数をまとめたファイル
 */
import type { UIConfig } from '../types'
import { useWebFontTypeSquare } from './webfont/type-square'
import { useWebFontAdobeFont } from './webfont/adobe-font'
import { useAppConfig } from '#imports'

export const useWebFont = () => {
	return {
		init,
	}
}

/**
 * 初期化
 */
const init = () => {
	if (typeof window === 'undefined' || !window.getComputedStyle) return null

	const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
	const config = appConfig.webfont ?? null

	// 設定がない場合は何もしない
	if (!config) return null

	if (config.adobeFont) {
		useWebFontAdobeFont().init(config.adobeFont)
	}
	if (config.typeSquare) {
		useWebFontTypeSquare().init(config.typeSquare)
	}

	return true
}

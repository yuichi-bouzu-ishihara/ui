/**
 * Google Font に関する関数をまとめたファイル
 */
import { useUI } from '../ui'
import { useEnvironment } from '../environment'
import type { WebfontConfig } from '../../types/webfont'
import { useState, readonly } from '#imports'

const DATA_VALUE = 'webfont-google'

export const useWebFontGoogleFont = () => {
	const isLoaded = useState<boolean>('ui-webfont-googleFont-isLoaded', () => false)
	const config = useState<WebfontConfig['googleFont'] | null>('ui-webfont-googleFont-config', () => null)

	/**
	 * Google Fonts CSS API v2 の URL を構築する
	 */
	const buildCssUrl = (fontConfig: WebfontConfig['googleFont']['list'][number]): string => {
		const family = fontConfig.family.replace(/ /g, '+')
		const weights = fontConfig.weight || ['400']
		const display = fontConfig.display || 'swap'

		let axisList: string
		let tupleList: string

		if (fontConfig.italic) {
			// italic + weight の2軸
			axisList = 'ital,wght'
			const tuples: string[] = []
			for (const w of weights) {
				tuples.push(`0,${w}`)
				tuples.push(`1,${w}`)
			}
			tupleList = tuples.sort().join(';')
		}
		else {
			axisList = 'wght'
			tupleList = [...weights].sort().join(';')
		}

		return `https://fonts.googleapis.com/css2?family=${family}:${axisList}@${tupleList}&display=${display}`
	}

	/**
	 * preconnect リンクを追加する
	 */
	const addPreconnect = () => {
		const origins = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']
		origins.forEach((origin) => {
			if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
				const link = document.createElement('link')
				link.rel = 'preconnect'
				link.href = origin
				if (origin.includes('gstatic')) {
					link.crossOrigin = 'anonymous'
				}
				document.head.appendChild(link)
			}
		})
	}

	/**
	 * 初期化
	 */
	const init = (payload: WebfontConfig['googleFont']) => {
		// 読み込み済みは何もしない
		if (isLoaded.value || typeof window === 'undefined') return
		// フォント指定がない場合は何もしない
		config.value = payload
		if (!config.value || !config.value.list || config.value.list.length === 0) return

		addPreconnect()

		const promises: Promise<unknown>[] = []
		const { os } = useEnvironment()

		config.value.list.forEach((fontConfig) => {
			// ファミリー名がない場合はスキップ
			if (!fontConfig.family) return

			const sizeAdjust = fontConfig.sizeAdjust || ''
			const ascentOverride = fontConfig.ascentOverride || 'normal'
			const descentOverride = fontConfig.descentOverride || 'normal'
			const exLocation = fontConfig.exLocation || []
			const exOS = fontConfig.exOS || []

			// フォントの読み込みを除外するページは、何もしない
			if (exLocation.length > 0 && exLocation.includes(location.href)) return
			// 現在のOSが exOS に含まれている場合はスキップ
			if (exOS.length > 0 && exOS.includes(os.value.name)) return

			const cssUrl = buildCssUrl(fontConfig)

			promises.push(
				new Promise<void>((resolve, reject) => {
					fetch(cssUrl)
						.then((response) => {
							if (!response.ok) throw new Error(`Failed to fetch Google Font CSS: ${response.status}`)
							return response.text()
						})
						.then((cssText) => {
							// @font-faceを抽出
							const fontFaceRegex = /@font-face\s*\{[^}]*\}/g
							const fontFaces = cssText.match(fontFaceRegex)

							if (fontFaces) {
								const modifiedFontFaces = fontFaces.map((face) => {
									return face.replace('}', `size-adjust: ${sizeAdjust}; ascent-override: ${ascentOverride}; descent-override: ${descentOverride}; }`)
								}).join('\n')

								// <style>タグに追加
								const styleElement = document.createElement('style')
								styleElement.setAttribute(`data-${useUI().dataKey}`, DATA_VALUE)
								styleElement.textContent = modifiedFontFaces
								document.head.appendChild(styleElement)
							}
							resolve()
						})
						.catch((error) => {
							console.error('Error loading Google Font:', error)
							reject(error)
						})
				}),
			)
		})

		if (promises.length) {
			Promise.allSettled(promises).then(() => {
				isLoaded.value = true
			}).catch((error: unknown) => {
				console.error(error)
			})
		}
	}

	return {
		init,
		isLoaded: readonly(isLoaded),
		config: readonly(config),
	}
}

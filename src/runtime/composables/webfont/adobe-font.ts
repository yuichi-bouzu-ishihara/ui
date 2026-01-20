/**
 * Adobe Font に関する関数をまとめたファイル
 */
import { useUI } from '../ui'
import { useEnvironment } from '../environment'
import type { WebfontConfig } from '../../types/webfont'
import { useState, readonly } from '#imports'

const DATA_VALUE = 'webfont-adobe'

export const useWebFontAdobeFont = () => {
	const isLoaded = useState<boolean>('ui-webfont-adobeFont-isLoaded', () => false)
	const config = useState<WebfontConfig['adobeFont'] | null>('ui-webfont-adobeFont-config', () => null)

	/**
	 * 初期化
	 */
	const init = (payload: WebfontConfig['adobeFont']) => {
		// 読み込み済みは何もしない
		if (isLoaded.value || typeof window === 'undefined') return
		// フォント指定がない場合は何もしない
		config.value = payload
		if (!config.value || !config.value.list || config.value.list.length === 0) return

		config.value = payload

		const promises: Promise<unknown>[] = []
		const { os } = useEnvironment()

		config.value.list.forEach((fontConfig) => {
			// プロジェクトIDがない場合はスキップ
			if (fontConfig.projectId) {
				const sizeAdjust = fontConfig.sizeAdjust || ''
				const ascentOverride = fontConfig.ascentOverride || 'normal'
				const descentOverride = fontConfig.descentOverride || 'normal'
				const exLocation = fontConfig.exLocation || []
				const exOS = fontConfig.exOS || []

				// フォントの読み込みを除外するページは、何もしない
				if (exLocation.length > 0 && exLocation.includes(location.href)) return
				// 現在のOSが exOS に含まれている場合はスキップ
				if (exOS.length > 0 && exOS.includes(os.value.name)) return

				// 日本語フォントが有効な場合の特別なスクリプト
				if (fontConfig.ja) {
					const scriptElement = document.createElement('script')
					scriptElement.innerHTML = `
						(function(d) {
							var config = {
								kitId: '${fontConfig.projectId}',
								scriptTimeout: 3000,
								async: true
							},
							h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js?t=${location.host}';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
						})(document);`
					document.head.appendChild(scriptElement)
				}
				else {
					const { os } = useEnvironment()
					// 読み込み除外 OS 以外は、WEBフォントを読み込む
					if (!exOS.includes(os.value.name)) {
						promises.push(
							new Promise<void>((resolve, reject) => {
								const cssUrl = `https://use.typekit.net/${fontConfig.projectId}.css`
								fetch(cssUrl)
									.then(response => response.text())
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
										console.error('Error loading or modifying font-face:', error)
										reject(error)
									})
							}),
						)
					}
				}
			}
		})

		if (promises.length) {
			Promise.allSettled(promises).then(() => {
				// 読み込み完了にする
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

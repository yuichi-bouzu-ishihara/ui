/**
 * 画像関連の便利関数をまとめたファイル
 */

import html2canvas from 'html2canvas'

const BASE_DEVICE_PIXEL_RATIO = 2 // デバイスピクセル比。レティナディスプレイなら2。それ以外は1。

export const useImage = () => {
	return {
		BASE_DEVICE_PIXEL_RATIO,
		optimize, // base64 画像を、指定の容量まで圧縮する
		resizeBase64, // Base64画像を指定したサイズにリサイズする
		elementEncodeBase64, // 指定エレメントをサイズを変更して Base64 エンコードする。
		elementCaptureBase64, // 指定エレメントを Base64 エンコードする
		dimensions, // base64 画像の縦横幅を返す
		download, // 指定urlの画像をダウンロードする
	}
}

/**
 * base64 画像を、指定の容量まで圧縮する
 * @param {string} base64 - Base64形式でエンコードされた画像データ。
 * @param {number} capacity - 最終的に得られるべき画像データの最大容量をバイトで指定します。この関数は、JPEG形式で圧縮することにより、出力される画像データがこの容量以下になるように調整します。ただし、画質とファイルサイズの間にはトレードオフの関係があるため、厳密にこの容量を守ることができるわけではない点に注意が必要です。そのため、実際の出力データの容量は少し上下することがあります。
 * @returns {Promise<string>} Resized image
 */
const optimize = async (base64: string, capacity: number): Promise<string> => {
	const ALLOWABLE_CAPACITY = 0.9
	const allowCapacity = capacity * ALLOWABLE_CAPACITY

	const originalSize = (await base64ToBlob(base64)).size

	if (originalSize <= allowCapacity) {
		return base64
	}

	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	if (!ctx) {
		throw new Error('Could not create 2D context on the canvas element.')
	}
	const image = new Image()
	image.src = base64

	await new Promise((resolve) => {
		image.onload = function () {
			canvas.width = image.width
			canvas.height = image.height
			ctx.drawImage(image, 0, 0, image.width, image.height)
			resolve(undefined)
		}
	})

	let lowerBound = 0.0
	let upperBound = 1.0
	let lastOptimizeSize = 0

	for (let i = 0; i < 10; i++) {
		const capacityRatio = (upperBound + lowerBound) / 2
		const optimizeBase64 = canvas.toDataURL('image/jpeg', capacityRatio)
		const optimizeSize = (await base64ToBlob(optimizeBase64)).size

		if (optimizeSize > allowCapacity) {
			upperBound = capacityRatio
		}
		else {
			lowerBound = capacityRatio
			lastOptimizeSize = optimizeSize
		}

		if (Math.abs(optimizeSize - allowCapacity) < 0.01 * allowCapacity) {
			return optimizeBase64
		}
	}

	if (lastOptimizeSize > allowCapacity) {
		return canvas.toDataURL('image/jpeg', lowerBound)
	}

	return canvas.toDataURL('image/jpeg', upperBound)
}

/**
 * Base64 を Blob に変換する。
 * @param {string} base64 - Base64形式でエンコードされた画像データ。
 * @returns {Promise<Blob>} Blob
 */
const base64ToBlob = async (base64: string): Promise<Blob> => {
	const bin = atob(base64.replace(/^.*,/, ''))
	const buffer = new Uint8Array(bin.length)

	for (let i = 0; i < bin.length; i++) {
		buffer[i] = bin.charCodeAt(i)
	}

	try {
		const blob = new Blob([buffer.buffer], {
			type: 'image/jpeg',
		})
		return blob
	}
	catch (e) {
		throw new Error('Could not convert Base64 to Blob.')
	}
}

/**
 * Base64画像を指定したサイズにリサイズする
 * @param {string} base64 Base64でエンコードされた画像
 * @param {number} maxWidth 画像の最大幅
 * @param {number} [maxHeight] 画像の最大高さ（オプショナル）
 * @returns {Promise<string>} リサイズされた画像
 */
const resizeBase64 = async (base64: string, maxWidth: number, maxHeight: number = 0): Promise<string> => {
	return await new Promise((resolve, reject) => {
		const img = new Image()
		img.src = base64
		img.onload = () => {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			if (!ctx) {
				reject(new Error('Could not create 2D context on the canvas element.'))
				return
			}
			const width = img.width
			const height = img.height

			// 画像サイズが指定されたサイズより大きい場合
			if (width > maxWidth || (maxHeight && height > maxHeight)) {
				if (width > height || !maxHeight) {
					// 横長またはmaxWidthのみ指定されている場合
					canvas.width = maxWidth
					canvas.height = (maxWidth * height) / width
				}
				else {
					// 縦長の場合
					canvas.width = (maxHeight * width) / height
					canvas.height = maxHeight
				}
			}
			else {
				canvas.width = width
				canvas.height = height
			}

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
			resolve(canvas.toDataURL())
		}
		img.onerror = reject
	})
}

/**
 * 指定エレメントを Base64 エンコードする。元のエレメントからサイズを指定できる。
 * @param {HTMLElement} element - Base64画像化するエレメント
 * @param {HTMLElement} [insertElement] - element を挿入するエレメント。スタイルを維持するなら必須。
 * @param {number} [width] - 指定の横幅 px
 * @param {number} [height] - 指定の縦幅 px
 * @returns {Promise<string|File>} base64 encoded string of the file if `base64` is true, else file
 */
const elementEncodeBase64 = async (
	element: HTMLElement,
	insertElement: HTMLElement | null = null,
	width = 0,
	height = 0,
) => {
	// 1. エレメントをクローンする
	let clonedElement = null
	if (element instanceof HTMLElement) {
		// cloneNodeを使用する
		clonedElement = element.cloneNode(true) as HTMLElement // キャスト変更
	}
	else {
		console.error('element is not a DOM node', element)
		return
	}

	// 2. クローンのサイズを変更する
	if (width && height) {
		clonedElement.style.transform = `${width}px`
		clonedElement.style.height = `${height}px`
	}
	clonedElement.style.position = 'fixed' // ビューポートの外でレンダリングするため
	clonedElement.style.top = '-10000vw' // ビューポートの外でレンダリングするため
	clonedElement.style.left = '-10000vh' // ビューポートの外でレンダリングするため
	if (insertElement) {
		insertElement.appendChild(clonedElement) // 一時的にDOMに追加
	}
	else {
		document.body.appendChild(clonedElement) // 一時的にDOMに追加
	}

	// 3. クローンを html2canvas に渡してキャンバスを生成する
	const canvas = await html2canvas(clonedElement)
	const base64 = canvas.toDataURL('image/png')

	// 4. 使用が終わったら、クローンをDOMから削除する
	if (insertElement) {
		insertElement.removeChild(clonedElement) // 修正した部分
	}
	else {
		document.body.removeChild(clonedElement)
	}

	return base64
}

/**
 * 指定エレメントを Base64 エンコードする。
 * @param {HTMLElement} element - Base64画像化するエレメント
 * @returns {Promise<string|File>} base64 encoded string of the file if `base64` is true, else file
 */
const elementCaptureBase64 = async (element: HTMLElement) => {
	const canvas = await html2canvas(element)
	const base64 = canvas.toDataURL('image/png')
	return base64
}

/**
 * base64 画像の縦横幅を返す
 * @param {string} base64 - Base64形式でエンコードされた画像データ。
 * @returns {Promise<{ width: number, height: number }>} 画像の縦横幅
 */
const dimensions = (base64: string): Promise<{ width: number, height: number }> => {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve({ width: img.width, height: img.height })
		img.onerror = reject
		img.src = base64
	})
}

/**
 * 指定urlの画像をダウンロードする
 * @param {string} url - ダウンロードする画像のURL
 * @param {string} [fileName] - ダウンロードする画像のファイル名
 */
const download = async (imageUrl: string, fileName: string = '') => {
	try {
		const response = await fetch(imageUrl, { mode: 'cors' })
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const blob = await response.blob()
		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.href = url
		link.download = fileName || imageUrl.split('/').pop() || 'image.png'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		URL.revokeObjectURL(url)
	}
	catch (error) {
		console.error('There was a problem with the fetch operation:', error)
	}
}

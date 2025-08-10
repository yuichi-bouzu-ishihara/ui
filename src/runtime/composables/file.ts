/**
 * 画像関連の便利関数をまとめたファイル
 */

// Video metadata types
export type VideoMetadata = {
	width: number
	height: number
	duration: number
	aspectRatio: number
	fileSize: number
	mimeType: string
}

// Image metadata types
export type ImageMetadata = {
	width: number
	height: number
	aspectRatio: number
	fileSize: number
	mimeType: string
}

export const useFile = () => {
	return {
		select,
		encode,
		download,
		getExtension,
		getExtensionByBase64,
		getFileTypeByExtension,
		getFileName,
		getExtensionByFilename,
		urlToFile,
		fileToBase64,
		getImageMetadata, // 画像のメタデータを取得
		getVideoMetadata, // 動画のメタデータを取得
	}
}

const select = async (accepts = ['image']): Promise<{ file: unknown, name: string, blob: string } | null> => {
	const acceptStrList: string[] = []

	accepts.forEach((accept) => {
		// カスタムのMIMEタイプや拡張子が直接指定されている場合
		if (accept.includes('/') || accept.startsWith('.')) {
			acceptStrList.push(accept)
			return
		}

		// 事前定義されたカテゴリの場合
		switch (accept) {
			case 'image':
				acceptStrList.push('.jpg, .jpeg, .png')
				break
			case 'audio':
				acceptStrList.push('audio/*')
				break
			case 'video':
				acceptStrList.push('video/*')
				break
			case 'document':
				acceptStrList.push(
					'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation',
				)
				break
			case 'text': // テキストファイルのみを選択するオプションを追加
				acceptStrList.push('text/plain, .txt')
				break
		}
	})

	const acceptStr = acceptStrList.join(', ')

	const input = document.createElement('input')
	input.type = 'file'
	input.accept = acceptStr

	const onchangePromise = new Promise<{ file: unknown, name: string, blob: string } | null>((resolve) => {
		input.onchange = async (e) => {
			if (e.target !== null) {
				const target = e.target as HTMLInputElement
				if (target.files && target.files.length > 0) {
					const file = target.files[0]
					const name = file.name
					resolve({ file, name, blob: URL.createObjectURL(file) })
				}
				else {
					resolve(null)
				}
			}
			else {
				resolve(null)
			}
		}

		// ファイル選択のキャンセルを検知
		document.body.onfocus = () => {
			setTimeout(() => {
				if (!input.files || input.files.length === 0) {
					resolve(null)
				}
				document.body.onfocus = null
			}, 500)
		}
	})

	input.click()

	return onchangePromise
}

/**
 * 上記 select で選択したファイルをエンコード（base64化）する。
 * @note 例： useFile().encode(image as string) という形で使う。
 * @param {string} fileUrl - エンコードするファイルのURL
 * @returns {Promise<string>} Base64 encoded string of the file
 */
const encode = async (fileUrl: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		fetch(fileUrl)
			.then(response => response.blob())
			.then((file) => {
				const reader = new FileReader()
				reader.onload = (e) => {
					if (e.target && typeof e.target.result === 'string') {
						resolve(e.target.result)
					}
					else {
						reject(new Error('Failed to read file as base64.'))
					}
				}
				reader.onerror = reject
				reader.readAsDataURL(file)
			})
			.catch(error => reject(error))
	})
}

/**
 * 指定ファイルをダウンロード
 * @param {string} url ダウンロードするファイルのURL
 * @param {string} name ダウンロード時のファイル名
 */
const download = (url: string, name: string) => {
	// `<a>`要素を作成
	const link = document.createElement('a')
	// ファイルのURLを`href`属性に設定
	link.href = url
	// ダウンロード時のファイル名を`download`属性に設定
	link.download = name
	// `<a>`要素をDOMに追加（表示はされない）
	document.body.appendChild(link)
	// リンクをクリックしてダウンロードを実行
	link.click()
	// `<a>`要素をDOMから削除
	document.body.removeChild(link)
}

/**
 * 選択されたファイルのファイル名を取得する関数。
 * @param {string} fileUrl 選択されたファイルのURL
 * @returns {string} ファイルの名前
 */
const getFileName = (fileUrl: string): string => {
	const urlParts = fileUrl.split('/')
	return urlParts[urlParts.length - 1]
}

/**
 * 選択されたファイルの拡張子を取得する関数。
 * @param {string} fileUrl 選択されたファイルのURL
 * @returns {Promise<string>} ファイルの拡張子
 */
const getExtension = async (fileUrl: string): Promise<string> => {
	try {
		const response = await fetch(fileUrl)
		const contentType = response.headers.get('Content-Type')
		let extension = ''

		switch (contentType) {
			case 'image/jpeg':
				extension = 'jpg'
				break
			case 'image/png':
				extension = 'png'
				break
			case 'audio/mpeg':
				extension = 'mp3'
				break
			case 'audio/wav':
				extension = 'wav'
				break
			case 'video/mp4':
				extension = 'mp4'
				break
			case 'application/pdf':
				extension = 'pdf'
				break
			case 'application/msword':
				extension = 'doc'
				break
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				extension = 'docx'
				break
			case 'application/vnd.ms-excel':
				extension = 'xls'
				break
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				extension = 'xlsx'
				break
			case 'application/vnd.ms-powerpoint':
				extension = 'ppt'
				break
			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
				extension = 'pptx'
				break
			case 'text/plain':
				extension = 'txt'
				break
			default:
				throw new Error('Unsupported file type')
		}

		return extension
	}
	catch (error) {
		throw new Error(`Failed to get file extension: ${error}`)
	}
}

/**
 * Base64エンコードされたデータからファイルの拡張子を取得する関数。
 * @param {string} base64Data Base64エンコードされたデータ
 * @returns {string} ファイルの拡張子
 */
const getExtensionByBase64 = (base64Data: string): string => {
	const mime = base64Data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]).*,.*/)
	if (!mime || mime.length < 2) {
		throw new Error('Invalid Base64 data')
	}
	const mimeType = mime[1]

	switch (mimeType) {
		case 'image/jpeg':
			return 'jpg'
		case 'image/png':
			return 'png'
		case 'audio/mpeg':
			return 'mp3'
		case 'audio/wav':
			return 'wav'
		case 'video/mp4':
			return 'mp4'
		case 'application/pdf':
			return 'pdf'
		case 'application/msword':
			return 'doc'
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return 'docx'
		case 'application/vnd.ms-excel':
			return 'xls'
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			return 'xlsx'
		case 'application/vnd.ms-powerpoint':
			return 'ppt'
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return 'pptx'
		default:
			throw new Error('Unsupported file type')
	}
}

/**
 * ファイルの拡張子からファイルタイプを判定する関数。
 * @param {string} extension ファイルの拡張子
 * @returns {string} ファイルタイプ
 */
const getFileTypeByExtension = (extension: string): string => {
	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'JPG', 'JPEG', 'PNG', 'GIF', 'BMP', 'SVG']
	const documentExtensions = [
		'pdf',
		'doc',
		'docx',
		'xls',
		'xlsx',
		'ppt',
		'pptx',
		'txt',
		'PDF',
		'DOC',
		'DOCX',
		'XLS',
		'XLSX',
		'PPT',
		'PPTX',
		'TXT',
	]

	if (imageExtensions.includes(extension)) {
		return 'image'
	}
	else if (documentExtensions.includes(extension)) {
		return 'document'
	}
	else {
		return 'other'
	}
}

/**
 * ファイル名から拡張子を取得する関数。
 * @param {string} filename ファイル名
 * @returns {string} ファイルの拡張子
 */
const getExtensionByFilename = (filename: string): string => {
	const dotIndex = filename.lastIndexOf('.')
	if (dotIndex === -1) return '' // ドットがない場合は空文字を返す
	return filename.substring(dotIndex + 1)
}

/**
 * URLからファイルオブジェクトを生成する関数。
 * @param {string} url ファイルのURL
 * @param {string} [filename] 保存するファイル名（省略可）
 * @param {string} [mimeType] ファイルのMIMEタイプ（省略可）
 * @returns {Promise<File>} 生成されたFileオブジェクト
 */
const urlToFile = async (url: string, filename: string = '', mimeType: string = '') => {
	const response = await fetch(url)
	const buffer = await response.arrayBuffer()

	// filenameが指定されていない場合、URLから取得
	if (!filename) {
		const urlParts = url.split('/')
		filename = urlParts[urlParts.length - 1]
	}

	// mimeTypeが指定されていない場合、filenameから推測
	if (!mimeType) {
		const extension = filename.split('.').pop()?.toLowerCase() || ''
		const mimeTypes: { [key: string]: string } = {
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			png: 'image/png',
			gif: 'image/gif',
			webp: 'image/webp',
			// 必要に応じて他の拡張子を追加
		}
		mimeType = mimeTypes[extension] || 'application/octet-stream'
	}

	const blob = new Blob([buffer], { type: mimeType })
	return new File([blob], filename, { type: mimeType })
}

/**
 * File を Base64 に変換
 * @param file - File オブジェクト
 * @returns Base64 文字列
 */
const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result)
			}
			else {
				reject(new Error('Failed to convert file to base64'))
			}
		}
		reader.onerror = () => reject(reader.error)
		reader.readAsDataURL(file)
	})
}

/**
 * 画像のメタデータを取得
 * @param file - 画像ファイル
 * @returns 画像のメタデータ（幅、高さ、アスペクト比など）
 */
const getImageMetadata = (file: File): Promise<{
	width: number
	height: number
	aspectRatio: number
	fileSize: number
	mimeType: string
}> => {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => {
			const aspectRatio = img.naturalWidth / img.naturalHeight
			resolve({
				width: img.naturalWidth,
				height: img.naturalHeight,
				aspectRatio,
				fileSize: file.size,
				mimeType: file.type,
			})
		}
		img.onerror = () => reject(new Error('Failed to load image metadata'))
		img.src = URL.createObjectURL(file)
	})
}

/**
 * 動画のメタデータを取得
 * @param file - 動画ファイル
 * @returns 動画のメタデータ（幅、高さ、長さ、アスペクト比など）
 */
const getVideoMetadata = (file: File): Promise<{
	width: number
	height: number
	duration: number
	aspectRatio: number
	fileSize: number
	mimeType: string
}> => {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video')
		video.onloadedmetadata = () => {
			const aspectRatio = video.videoWidth / video.videoHeight
			resolve({
				width: video.videoWidth,
				height: video.videoHeight,
				duration: video.duration,
				aspectRatio,
				fileSize: file.size,
				mimeType: file.type,
			})
		}
		video.onerror = () => reject(new Error('Failed to load video metadata'))
		video.src = URL.createObjectURL(file)
	})
}

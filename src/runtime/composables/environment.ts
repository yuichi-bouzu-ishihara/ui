/**
 * Viewport に関する関数をまとめたファイル
 */

import { ref } from 'vue'

// 定数
const NUXT_ROOT_ID = '__nuxt'

// 変数
const isInitialized = ref<boolean>(false) // 初期化フラグ
const userAgent = ref<string>('') // アクセス環境を文字列で保持
const device = ref<string>('')
const devicePixelRatio = ref<number>(1) // デバイスのピクセル比
const language = ref<string>('')
const os = ref<{ name: string, version: string }>({ name: '', version: '' })
const browser = ref<{ name: string, version: string }>({ name: '', version: '' })
const touchDevice = ref<boolean>(false)

export const useEnvironment = () => {
	return {
		init,
		userAgent,
		device,
		devicePixelRatio,
		language,
		os,
		browser,
		touchDevice,
	}
}

/**
 * 初期化
 */
const init = () => {
	if (isInitialized.value || typeof window === 'undefined' || !window.matchMedia) return

	update() // デバイス情報を更新するメソッドを呼び出し

	const mediaQueryList = window.matchMedia('(pointer: coarse)')
	mediaQueryList.addEventListener('change', update)

	// resizeイベントを利用してウィンドウサイズの変更を監視
	window.addEventListener('resize', update)

	// 初期化済みフラグをセット
	isInitialized.value = true
}

/**
 * 更新
 */
const update = () => {
	// エミュレートのオン/オフに関わらず、タッチデバイスの状態を正確に判定するロジックを実装
	// ここでは、簡単のために以前のコードをそのまま使用していますが、
	// 実際にはエミュレートのオン/オフをより正確に検出するための追加のロジックが必要になる場合があります。
	const newTouchDevice = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches

	/**
	 * 以下はより完全な判定方法ですが、'ontouchstart' in window がエミュレートのオン/オフで変化しない、
	 * つまり、サイト読み込み時から判定が変わらないので、使用しないことにしています。
	 * 現在は、touchDevice state は /stores/dev.ts でのみ使用しているため、開発時にのみ動作すれば良いためです。
	 * const newTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches
	 */

	if (touchDevice.value !== newTouchDevice) {
		touchDevice.value = newTouchDevice
		document.dispatchEvent(new CustomEvent('touchDeviceChanged', { detail: touchDevice.value }))
	}

	// クラスのクリーンアップ
	document.getElementById(NUXT_ROOT_ID)?.classList.remove(
		'_mobile',
		'_desktop',
		toCamelCaseWithUnderscore(os.value.name || ''),
		toCamelCaseWithUnderscore(browser.value.name || ''),
	)

	// デバイス情報の更新
	os.value = getOSInfo()
	browser.value = getBrowserInfo()
	userAgent.value = navigator.userAgent.toLowerCase()
	device.value = /Mobile|iP(?:hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent) ? 'mobile' : 'desktop'
	devicePixelRatio.value = window.devicePixelRatio
	language.value = navigator.language

	// 新しいクラスの追加
	document.getElementById(NUXT_ROOT_ID)?.classList.add(toCamelCaseWithUnderscore(device.value))
	document.getElementById(NUXT_ROOT_ID)?.classList.add(toCamelCaseWithUnderscore(os.value.name))
	document.getElementById(NUXT_ROOT_ID)?.classList.add(toCamelCaseWithUnderscore(browser.value.name))
}

/**
 * ブラウザ情報を取得する
 * @returns { name: string, version: string } ブラウザの名前とバージョンを含むオブジェクト
 */
const getBrowserInfo = () => {
	const userAgent = navigator.userAgent
	let name = 'Unknown'
	let version = ''

	let match: RegExpMatchArray | null

	if (/CriOS/i.test(userAgent) && /iPhone|iPad|iPod/.test(userAgent)) {
		name = 'Chrome'
		match = userAgent.match(/CriOS\/\d+(\.\d+)?/)
		version = match ? match[1] : ''
	}
	else if (/Firefox/i.test(userAgent)) {
		name = 'Firefox'
		match = userAgent.match(/Firefox\/\d+(\.\d+)?/)
		version = match ? match[1] : ''
	}
	else if (/Chrome/i.test(userAgent)) {
		name = 'Chrome'
		match = userAgent.match(/Chrome\/\d+(\.\d+)?/)
		version = match ? match[1] : ''
	}
	else if (/Safari/i.test(userAgent) && /iPhone|iPad|iPod/.test(userAgent)) {
		name = 'Safari'
		match = userAgent.match(/Version\/\d+(\.\d+)?/)
		version = match ? match[1] : ''
	}
	else if (/MSIE/i.test(userAgent)) {
		name = 'Internet Explorer'
		match = userAgent.match(/MSIE \d+(\.\d+)?/)
		version = match ? match[1] : ''
	}
	else if (/Edge/i.test(userAgent)) {
		name = 'Edge'
		match = userAgent.match(/Edge\/\d+(\.\d+)?/)
		version = match ? match[1] : ''
	}

	return {
		name,
		version,
	}
}

/**
 * OS情報を取得する
 * @returns { name: string, version: string } OSの名前とバージョンを含むオブジェクト
 */
const getOSInfo = () => {
	const userAgent = navigator.userAgent
	let name = 'Unknown'
	let version = ''

	if (/Windows/i.test(userAgent)) {
		name = 'Windows'
		version = 'NT '
	}
	else if (/Macintosh/i.test(userAgent)) {
		name = 'Macintosh'
		version = 'OS X '
	}
	else if (/Linux/i.test(userAgent)) {
		name = 'Linux'
		version = 'Linux '
	}
	else if (/iPad|iPhone|iPod/.test(userAgent)) {
		name = 'iOS'
	}
	else if (/Android/.test(userAgent)) {
		name = 'Android'
	}

	return {
		name,
		version,
	}
}

// 先頭の文字を小文字にし、単語の区切りごとに大文字にする
const toCamelCaseWithUnderscore = (str: string) => {
	return (
		'_'
		+ str
			.replace(/^\w|[A-Z]|\b\w/g, function (word, index) {
				return index === 0 ? word.toLowerCase() : word.toUpperCase()
			})
			.replace(/\s+/g, '')
	)
}

/**
 * 正規表現をまとめたファイル
 */

export const useRegex = () => {
	return {
		convertRegexToPattern,
		email,
		emailPattern,
		url,
		urlPattern,
		postalCode,
		postalCodePattern,
		bankAccountNumber,
		bankAccountNumberPattern,
		bankAccount7Number,
		bankAccount7NumberPattern,
		noOnlySpace,
		noOnlySpacePattern,
		zenkakuKana,
		zenkakuKanaPattern,
		upperCaseAlphanumeric,
		upperCaseAlphanumericPattern,
		xProfileUrl,
		xProfileUrlPattern,
		youtubeChannelUrl,
		youtubeChannelUrlPattern,
		threadsProfileUrl,
		threadsProfileUrlPattern,
		instagramProfileUrl,
		instagramProfileUrlPattern,
		tiktokProfileUrl,
		tiktokProfileUrlPattern,
		isColorHexOrRgbOrRgba,
		isCssColor,
	}
}

/**
 * 正規表現を、html input pattern の形式に変換して返す
 * @param regex 変換する正規表現
 * @returns {string} 変換後の文字列
 */
const convertRegexToPattern = (regex: RegExp): string => {
	const str = regex.toString()
	// 最初と最後の / を削除し、フラグも削除
	return str.slice(1, str.lastIndexOf('/'))
}

// Emailアドレス -------------------------------------
const email
	= /^[\w.!#$&'+/=?^{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i
const emailPattern = convertRegexToPattern(email)

// URL -------------------------------------
const url = /^[a-z][\w-]{3,99}$/i
const urlPattern = convertRegexToPattern(url)

// 郵便番号 -------------------------------------
// 123-4567 または 1234567 の形式
const postalCode = /^\d{3}-\d{4}$|^\d{7}$/
const postalCodePattern = convertRegexToPattern(postalCode)

// 口座番号 -------------------------------------
// 0123456 または 1234567 の形式
const bankAccountNumber = /^\d+$/
const bankAccountNumberPattern = convertRegexToPattern(bankAccountNumber)
// 桁数を7桁にする
const bankAccount7Number = /^\d{7}$/
const bankAccount7NumberPattern = convertRegexToPattern(bankAccount7Number)

// 半角・全角空白のみではない -------------------------------------
const noOnlySpace = /^\s*$/
const noOnlySpacePattern = convertRegexToPattern(noOnlySpace)

// 全角カナ -------------------------------------
// eslint-disable-next-line regexp/no-obscure-range
const zenkakuKana = /^[ァ-ヶー\u3000（）]+$/
const zenkakuKanaPattern = convertRegexToPattern(zenkakuKana)

// 半角英数字かつ英語は大文字のみ -------------------------------------
const upperCaseAlphanumeric = /^[A-Z0-9]+$/
const upperCaseAlphanumericPattern = convertRegexToPattern(upperCaseAlphanumeric)

// X プロフィール URL
const xProfileUrl = /^https?:\/\/(?:www\.)?x\.com\/(\w{1,15})$/
const xProfileUrlPattern = convertRegexToPattern(xProfileUrl)

// Youtube チャンネル URL
const youtubeChannelUrl = /^https:\/\/(www\.)?youtube\.com\/(channel|c)\/[\w-]+$/
const youtubeChannelUrlPattern = convertRegexToPattern(youtubeChannelUrl)

// Threads プロフィール URL
const threadsProfileUrl = /^https:\/\/www\.threads\.net\/@[\w.]+$/
const threadsProfileUrlPattern = convertRegexToPattern(threadsProfileUrl)

// Instagram プロフィール URL
const instagramProfileUrl = /^https:\/\/www\.instagram\.com\/[\w.]+$/
const instagramProfileUrlPattern = convertRegexToPattern(instagramProfileUrl)

// Tiktok プロフィール URL
const tiktokProfileUrl = /^https:\/\/www\.tiktok\.com\/@[\w.]+$/
const tiktokProfileUrlPattern = convertRegexToPattern(tiktokProfileUrl)

/**
 * カラーがhex、rgb、またはrgba形式かどうかを判定する
 * @param color 判定するカラー文字列
 * @returns {boolean} hex、rgb、またはrgba形式の場合true
 */
const isColorHexOrRgbOrRgba = (color: string): boolean => {
	const hex = /^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/i
	const rgb = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i
	const rgba = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i
	return hex.test(color) || rgb.test(color) || rgba.test(color)
}

/**
 * CSSのカラー値かどうかを判定する
 * @param color 判定するカラー文字列
 * @returns {boolean} CSSカラー値の場合true
 */
const isCssColor = (color: string): boolean => {
	// 既存のhex、rgb、rgba形式
	const hex = /^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/i
	const rgb = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i
	const rgba = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i

	// CSS変数（var()）
	const cssVar = /^var\(\s*--[\w-]+\s*(?:,[^)]+)?\)$/i

	// その他のCSSカラー値
	const hsl = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i
	const hsla = /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/i

	// 名前付きカラー（transparent、currentColor、inherit、initial、unset等）
	const namedColors = /^(?:transparent|currentColor|inherit|initial|unset|revert|revert-layer)$/i

	return hex.test(color) || rgb.test(color) || rgba.test(color) || cssVar.test(color) || hsl.test(color) || hsla.test(color) || namedColors.test(color)
}

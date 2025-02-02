/**
 * 文字列関連の関数をまとめたファイル
 */

export const useString = () => {
	return {
		convertSmallToLargeKana,
		sanitize,
		camelToKebab,
		kebabToCamel,
	}
}

/**
 * 小さい仮名（カナ）を大きい仮名（カナ）に変換する
 * @param {string} input 変換する文字列
 * @returns {string} 変換後の文字列
 */
const convertSmallToLargeKana = (input: string): string => {
	const smallToLargeMapping: Record<string, string> = {
		ぁ: 'あ',
		ぃ: 'い',
		ぅ: 'う',
		ぇ: 'え',
		ぉ: 'お',
		ゃ: 'や',
		ゅ: 'ゆ',
		ょ: 'よ',
		ァ: 'ア',
		ィ: 'イ',
		ゥ: 'ウ',
		ェ: 'エ',
		ォ: 'オ',
		ャ: 'ヤ',
		ュ: 'ユ',
		ョ: 'ヨ',
		っ: 'つ',
		ッ: 'ツ',
	}

	return input
		.split('')
		.map((char) => {
			const largeChar = smallToLargeMapping[char]
			return largeChar ? largeChar : char
		})
		.join('')
}

/**
 * 文字列をサニタイズする
 * @param {string} str - サニタイズする文字列
 */
const sanitize = (str: string): string => {
	return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * キャメルケースをハイフン形式に変換する関数
 * @param str
 * @returns
 */
const camelToKebab = (str: string): string => {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * ハイフン形式をキャメルケースに変換する関数
 * @param str
 * @returns
 */
const kebabToCamel = (str: string): string => {
	return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

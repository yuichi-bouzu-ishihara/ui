/**
 * 数値関連の関数をまとめたファイル
 */

export const useNumber = () => {
	return {
		joinComma,
		isPureNumber,
		randomRange,
	}
}

/**
 * 数値にカンマを付ける
 * @param {number} num - 変換する数値
 */
const joinComma = (num: number): string => {
	return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
}

/**
 * 文字列が純粋な数字かどうかを判定する（小数点を含む数値も許容）
 * @note 負の符号、1つ以上の数字、小数点 を数値と判定します。
 * @param {string} input - 判定する文字列
 */
const isPureNumber = (input: string | number): boolean => {
	const pattern = /^-?\d+(\.\d+)?$/
	return pattern.test(String(input))
}

/**
 * min 以上 max 以下のランダム整数値を返す
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 */
const randomRange = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

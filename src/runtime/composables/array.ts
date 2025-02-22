/**
 * 配列に関する関数をまとめたファイル
 */

export const useArray = () => {
	return {
		equal,
		shuffle,
		unique,
		numberArray,
	}
}

/**
 * A B が等しいかどうかを判定する
 * @param {Array<number | string>} a - 比較対象A
 * @param {Array<number | string>} b - 比較対象B
 * @returns {boolean} 等しいかどうか
 */
const equal = (a: Array<number | string>, b: Array<number | string>) => {
	return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * 配列をシャッフルする
 * @param {Array<any>} arr - シャッフルする配列
 * @returns {Array<any>} シャッフルされた配列
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffle = (arr: Array<any>): Array<any> => {
	const newArray = []
	while (arr.length > 0) {
		const n = arr.length
		const k = Math.floor(Math.random() * n)

		newArray.push(arr[k])
		arr.splice(k, 1)
	}
	return newArray
}

/**
 * 重複をなくしてユニークな配列を返す
 * @param {Array<any>} arr - 配列
 * @returns {Array<any>} ユニークになった配列
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unique = (arr: Array<any>): Array<any> => {
	return Array.from(new Set(arr.map(item => JSON.stringify(item)))).map(item => JSON.parse(item))
}

/**
 * 指定された開始値から連続する数値の配列を作成する
 * @param {number} start - 開始値
 * @param {number} length - 配列の長さ
 * @returns {Array<number>} 連続する数値の配列
 */
const numberArray = (start: number, length: number): Array<number> => {
	return Array.from({ length }, (_, index) => start + index)
}

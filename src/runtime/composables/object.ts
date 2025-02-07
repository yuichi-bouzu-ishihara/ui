/**
 * オブジェクトに関する関数をまとめたファイル
 */

export const useObject = () => {
	return {
		isEmpty,
		isObject,
		isEqual,
	}
}

/**
 * オブジェクトが空かどうかを返す。
 * @param obj
 */
const isEmpty = (obj: object): boolean => {
	return Object.keys(obj).length === 0 && obj.constructor === Object
}

/**
 * Objectかどうかを返す。
 * @param {any} value - 判定する値
 * @note ArrayはObjectだが、falseで返す。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (value: any): boolean => {
	let flag = value !== null && typeof value === 'object'
	if (flag) {
		if (Array.isArray(value)) {
			flag = false
		}
	}
	return flag
}

/**
 * 2つのオブジェクトが等しいかどうかを返す。
 * @param {any} a - 比較するオブジェクト
 * @param {any} b - 比較するオブジェクト
 * @returns {boolean} - 等しい場合はtrue
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEqual = (a: any, b: any): boolean => {
	// オブジェクトでなければ、単純な比較を行います
	if (!isObject(a) || !isObject(b)) {
		return a === b
	}

	// 両方のオブジェクトのキーの数が同じであることを確認します
	const aKeys = Object.keys(a)
	const bKeys = Object.keys(b)
	if (aKeys.length !== bKeys.length) {
		return false
	}

	// 各キーに対して再帰的な比較を行います
	for (const key of aKeys) {
		if (!bKeys.includes(key) || !isEqual(a[key], b[key])) {
			return false
		}
	}

	return true
}

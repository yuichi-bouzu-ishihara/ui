/**
 * 便利関数をまとめたファイル
 */

export const useUtils = () => {
	return {
		wait,
		copy, // 文字列のコピー
	}
}

/**
 * 指定ミリ秒数待機して指定の関数を叩く
 * @param {number} milliSeconds 待機するミリ秒
 * @returns
 */
const wait = (milliSeconds: number) => {
	return new Promise((resolve) => {
		const timerId = setTimeout(() => {
			resolve(timerId)
		}, milliSeconds)
	})
}

/**
 * 文字列のコピー
 * @param {string} str コピーする文字列
 * @returns
 */
const copy = async (str: string) => {
	try {
		await navigator.clipboard.writeText(str)
	}
	catch (err) {
		throw new Error('コピーに失敗しました')
	}
}

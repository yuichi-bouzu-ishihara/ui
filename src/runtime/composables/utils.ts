/**
 * 便利関数をまとめたファイル
 */

export const useUtils = () => {
	/**
	 * 指定ミリ秒数待機して指定の関数を叩く
	 * @param {number} milliSeconds 待機するミリ秒
	 */
	const wait = (milliSeconds: number) => {
		return new Promise((resolve) => {
			const timerId = setTimeout(() => {
				resolve(timerId)
			}, milliSeconds)
		})
	}

	/**
	 * レイアウト計算が完了するまで待機する
	 * requestAnimationFrameを2回ネストして、DOM更新とレイアウト計算の完了を待つ
	 * @returns Promise - レイアウト完了時に解決されるPromise
	 */
	const waitForLayout = (): Promise<void> => {
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					resolve()
				})
			})
		})
	}

	/**
	 * 文字列のコピー
	 * @param {string} str コピーする文字列
	 */
	const copy = async (str: string) => {
		try {
			await navigator.clipboard.writeText(str)
		}
		catch (error) {
			throw new Error('コピーに失敗しました', { cause: error })
		}
	}

	return {
		wait,
		waitForLayout,
		copy, // 文字列のコピー
	}
}

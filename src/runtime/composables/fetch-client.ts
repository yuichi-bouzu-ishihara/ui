import { ref } from 'vue'

export interface FetchOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
	headers?: HeadersInit
	body?: object
	query?: string
	csrf?: boolean
	cache?: string | boolean | undefined
	signal?: AbortSignal
}

export function useFetchClient() {
	const error = ref<Error | null>(null)
	const processing = ref<boolean>(false)

	/**
	 * タイムスタンプキャッシュ
	 * @param {string|boolean|undefined} cache - 日時文字列を指定してキャッシュをコントロールする。 false は現在のローカル日時指定。
	 * @returns {{ cache?: string }} キャッシュコントロール文字列を含むオブジェクト
	 */
	const timestampCache = (cache: string | boolean | undefined): string => {
		let str = ''
		if (cache === false) {
			str = new Date().toISOString()
		}
		else if (typeof cache === 'string') {
			str = cache
		}
		return str
	}

	/**
	 * Object を query string 化する
	 * @param {any} obj query string 化するオブジェクト。ネストは不可。例：{page:1, limit:100,,,}
	 * @returns ?page=1&limit=100 などの文字列。引数が空だった場合は、空の文字列が返る。
	 */
	const queryString = (obj: Record<string, string | number | boolean>) => {
		// query string 化する
		let str = new URLSearchParams(
			Object.entries(obj).map(([key, value]) => [key, String(value)]),
		).toString()
		// 文字列があれば、?をつける
		if (str) str = `?${str}`
		return str
	}

	const request = async (url: string, options: FetchOptions = {}) => {
		processing.value = true
		error.value = null

		try {
			if (options.method === 'GET' || options.method === 'PUT' || options.method === 'DELETE') {
				// URLの作成 クエリ + キャッシュ
				if (options.query) {
					url += `?${options.query}`
					if (options.cache) {
						url += `&${timestampCache(options.cache)}`
					}
				}

				// キャッシュポリシーの設定
				let cacheControl
				if (options.cache === true) {
					cacheControl = 'force-cache'
				}
				else if (options.cache === false) {
					cacheControl = 'no-cache'
				}
				else if (typeof options.cache === 'string') {
					cacheControl = 'public, max-age=31536000'
				}
				if (cacheControl) {
					options.headers = {
						...options.headers,
						'Cache-Control': cacheControl,
					}
				}
			}

			const response = await fetch(url, {
				method: options.method || 'GET',
				headers: {
					'Content-Type': 'application/json',
					...options.headers,
				},
				body: options.body ? JSON.stringify(options.body) : null,
				signal: options.signal,
			})

			if (!response.ok) {
				let errorMessage = `HTTP error! status: ${response.status}`

				// サーバーからのエラーメッセージを取得
				try {
					const errorData = await response.json()
					errorMessage = errorData.message || errorMessage
				}
				catch (parseError) {
					// JSON パースに失敗した場合はデフォルトメッセージを使用
					console.error('parseError', parseError)
				}

				const error = new Error(errorMessage)
				error.name = response.status.toString()
				throw error
			}

			const contentType = response.headers.get('content-type')
			if (contentType?.includes('application/json')) {
				return await response.json()
			}
			return await response.text()
		}
		catch (err) {
			if (err instanceof TypeError) {
				// ネットワークエラーやCORSエラー
				console.error('Network error or CORS issue:', err.message)
			}
			else {
				// 上記以外のエラー（HTTPエラーなど）
				console.error('Fetch error:', err)
			}
			const finalError = err instanceof Error ? err : new Error('Unexpected error')
			error.value = finalError
			throw finalError
		}
		finally {
			processing.value = false
		}
	}

	return {
		error,
		processing,
		request,
		queryString,
		timestampCache,
	}
}

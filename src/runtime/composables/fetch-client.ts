import { ref } from 'vue'

export interface FetchOptions {
	method?: 'GET' | 'POST'
	headers?: HeadersInit
	body?: object
	csrf?: boolean
	cache?: string | boolean | undefined
}

export function useFetchClient() {
	const error = ref<Error | null>(null)
	const processing = ref<boolean>(false)

	/**
	 * タイムスタンプキャッシュ
	 * @param {string|boolean|undefined} cache - 日時文字列を指定してキャッシュをコントロールする。 false は現在のローカル日時指定。
	 * @returns {{ cache?: string }} キャッシュコントロール文字列を含むオブジェクト
	 */
	const timestampCache = (cache: string | boolean | undefined): { cache?: string } => {
		let obj = {}
		if (cache === false) {
			obj = { cache: new Date().toISOString() }
		}
		else if (typeof cache === 'string') {
			obj = { cache }
		}
		return obj
	}

	/**
	 * Object を query string 化する
	 * @param {any} obj query string 化するオブジェクト。ネストは不可。例：{page:1, limit:100,,,}
	 * @returns ?page=1&limit=100 などの文字列。引数が空だった場合は、空の文字列が返る。
	 */
	const queryString = (obj: any) => {
		// query string 化する
		let str = new URLSearchParams(obj).toString()
		// 文字列があれば、?をつける
		if (str) str = `?${str}`
		return str
	}

	const request = async (url: string, options: FetchOptions = {}) => {
		processing.value = true
		error.value = null

		try {
			if (options.method === 'GET') {
				// URLの作成 クエリ + キャッシュ
				url += queryString({ ...options.body, ...timestampCache(options.cache) })

				// キャッシュポリシーの設定
				let cacheControl
				if (options.cache === true) {
					// キャッシュを強制的に有効にする
					cacheControl = 'force-cache'
				}
				else if (options.cache === false) {
					// キャッシュを無効にする
					cacheControl = 'no-cache'
				}
				else if (typeof options.cache === 'string') {
					// 文字列の場合は、キャッシュを有効にし、キャッシュはタイムスタンプ次第にする
					cacheControl = 'public, max-age=31536000' // 例: 1年間キャッシュ
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
				body: options.method !== 'GET' && options.body ? JSON.stringify(options.body) : null,
			})

			// if (!response.ok) {
			// throw await response.json()
			// throw new Error(`HTTP error! status: ${response.status}`, await response.json())
			// }
			const contentType = response.headers.get('content-type')
			if (contentType?.includes('application/json')) {
				return await response.json()
			}
			return await response.text()
		}
		catch (err) {
			error.value = err as Error
			throw err
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

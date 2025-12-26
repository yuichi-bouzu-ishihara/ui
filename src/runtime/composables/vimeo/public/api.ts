/**
 * Vimeo に関する公開APIをまとめたファイル
 */

export const useVimeoPublicApi = () => {
	return {
		getMetadata: async (videoId: string) => {
			// サムネイル取得
			try {
				const res = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}&width=1920&t=${Date.now()}`, { method: 'GET' })
				const resJson = await res.json()
				return resJson
			}
			catch (error: unknown) {
				console.error('Vimeo metadata error:', error)
			}
		},
	}
}

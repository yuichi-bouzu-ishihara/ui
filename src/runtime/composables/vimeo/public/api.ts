/**
 * Vimeo に関する公開APIをまとめたファイル
 */

export const useVimeoPublicApi = () => {

	const getMetadata = async (videoId: string) => {
		try {
			const res = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}&width=1920&t=${Date.now()}`, { method: 'GET' })
			const resJson = await res.json()
			return resJson
		}
		catch (error: unknown) {
			console.error('Vimeo metadata error:', error)
		}
	}

	const getThumbnailUrl = async (videoId: string) => {
		const metadata = await getMetadata(videoId)
		return metadata.thumbnail_url
	}

	return {
		getMetadata,
		getThumbnailUrl,
	}
}

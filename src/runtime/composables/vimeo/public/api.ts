/**
 * Vimeo に関する公開APIをまとめたファイル
 */

export const useVimeoPublicApi = () => {

	// Unlisted 動画用に hash トークン付きの視聴URLを組み立てる
	const buildVideoUrl = (videoId: string, videoHash?: string): string => {
		return videoHash
			? `https://vimeo.com/${videoId}/${videoHash}`
			: `https://vimeo.com/${videoId}`
	}

	const getMetadata = async (videoId: string, videoHash?: string) => {
		try {
			const url = buildVideoUrl(videoId, videoHash)
			const res = await fetch(
				`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}&width=1920&t=${Date.now()}`,
				{ method: 'GET' },
			)
			const resJson = await res.json()
			return resJson
		}
		catch (error: unknown) {
			console.error('Vimeo metadata error:', error)
		}
	}

	const getThumbnailUrl = async (videoId: string, videoHash?: string) => {
		const metadata = await getMetadata(videoId, videoHash)
		return metadata?.thumbnail_url as string | undefined
	}

	return {
		buildVideoUrl,
		getMetadata,
		getThumbnailUrl,
	}
}

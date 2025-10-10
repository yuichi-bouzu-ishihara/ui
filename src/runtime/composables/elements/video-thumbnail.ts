export const useVideoThumbnail = () => {
	/**
	 * base64の動画ファイルから最初のフレームをサムネイル画像として抽出する
	 * @param base64Video - base64エンコードされた動画データ
	 * @param options - オプション設定
	 * @param options.quality - 画像の品質（0.0-1.0、デフォルト: 0.8）
	 * @param options.format - 画像フォーマット（デフォルト: 'image/jpeg'）
	 * @returns Promise<string> - base64エンコードされたサムネイル画像
	 */
	const extractThumbnail = async (
		base64Video: string,
		options: {
			quality?: number
			format?: 'image/jpeg' | 'image/png' | 'image/webp'
		} = {},
	): Promise<string> => {
		const {
			quality = 0.8,
			format = 'image/jpeg',
		} = options

		return new Promise((resolve, reject) => {
			// Video要素を作成
			const video = document.createElement('video')
			video.crossOrigin = 'anonymous'
			video.muted = true
			video.playsInline = true

			// Canvas要素を作成
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			if (!ctx) {
				reject(new Error('Canvas context could not be created'))
				return
			}

			// 動画の元のサイズを取得する関数
			const getVideoSize = () => {
				return {
					width: video.videoWidth,
					height: video.videoHeight,
				}
			}

			// より確実に最初のフレームを取得するためのイベントハンドラー
			const captureFrame = () => {
				try {
					// 動画の時間を確実に0に設定
					video.currentTime = 0

					// 少し待ってからフレームをキャプチャ
					setTimeout(() => {
						try {
							// 動画サイズを取得
							const videoSize = getVideoSize()

							// Canvasのサイズを設定
							canvas.width = videoSize.width
							canvas.height = videoSize.height

							// 動画の最初のフレームをCanvasに描画
							ctx.drawImage(video, 0, 0, videoSize.width, videoSize.height)

							// Canvasからbase64画像を取得
							const thumbnailBase64 = canvas.toDataURL(format, quality)

							// リソースをクリーンアップ
							video.pause()
							video.src = ''
							video.load()

							resolve(thumbnailBase64)
						}
						catch (error) {
							reject(error)
						}
					}, 50)
				}
				catch (error) {
					reject(error)
				}
			}

			// 複数のイベントでフレームキャプチャを試行
			video.oncanplay = () => {
				// 動画が再生可能になったら、少し待ってからキャプチャ
				setTimeout(captureFrame, 50)
			}

			video.onloadeddata = () => {
				// データが読み込まれたら、少し待ってからキャプチャ
				setTimeout(captureFrame, 100)
			}

			video.onseeked = () => {
				// シーク操作が完了したら、フレームをキャプチャ
				setTimeout(() => {
					try {
						// 動画サイズを取得
						const videoSize = getVideoSize()

						// Canvasのサイズを設定
						canvas.width = videoSize.width
						canvas.height = videoSize.height

						// 動画の最初のフレームをCanvasに描画
						ctx.drawImage(video, 0, 0, videoSize.width, videoSize.height)

						// Canvasからbase64画像を取得
						const thumbnailBase64 = canvas.toDataURL(format, quality)

						// リソースをクリーンアップ
						video.pause()
						video.src = ''
						video.load()

						resolve(thumbnailBase64)
					}
					catch (error) {
						reject(error)
					}
				}, 10)
			}

			video.onerror = (error) => {
				reject(new Error(`Video loading error: ${error}`))
			}

			// 動画を読み込み開始
			video.src = base64Video
			video.load()
		})
	}

	/**
	 * base64の動画ファイルから複数のフレームをサムネイル画像として抽出する
	 * @param base64Video - base64エンコードされた動画データ
	 * @param frameCount - 抽出するフレーム数
	 * @param options - オプション設定
	 * @param options.quality - 画像の品質（0.0-1.0、デフォルト: 0.8）
	 * @param options.format - 画像フォーマット（デフォルト: 'image/jpeg'）
	 * @returns Promise<string[]> - base64エンコードされたサムネイル画像の配列
	 */
	const extractMultipleFrames = async (
		base64Video: string,
		frameCount: number = 3,
		options: {
			quality?: number
			format?: 'image/jpeg' | 'image/png' | 'image/webp'
		} = {},
	): Promise<string[]> => {
		const {
			quality = 0.8,
			format = 'image/jpeg',
		} = options

		return new Promise((resolve, reject) => {
			const video = document.createElement('video')
			video.crossOrigin = 'anonymous'
			video.muted = true
			video.playsInline = true

			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			if (!ctx) {
				reject(new Error('Canvas context could not be created'))
				return
			}

			const thumbnails: string[] = []
			let currentFrame = 0

			video.onloadedmetadata = () => {
				canvas.width = video.videoWidth
				canvas.height = video.videoHeight
			}

			video.onseeked = () => {
				try {
					// 現在のフレームをCanvasに描画
					ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
					const thumbnailBase64 = canvas.toDataURL(format, quality)
					thumbnails.push(thumbnailBase64)

					currentFrame++

					if (currentFrame < frameCount) {
						// 次のフレームにシーク
						const nextTime = (video.duration / frameCount) * currentFrame
						video.currentTime = nextTime
					}
					else {
						// 全てのフレームを取得完了
						video.pause()
						video.src = ''
						video.load()
						resolve(thumbnails)
					}
				}
				catch (error) {
					reject(error)
				}
			}

			video.onerror = (error) => {
				reject(new Error(`Video loading error: ${error}`))
			}

			video.onloadeddata = () => {
				// 最初のフレームから開始
				video.currentTime = 0
			}

			video.src = base64Video
			video.load()
		})
	}

	/**
	 * 動画のメタデータを取得する
	 * @param base64Video - base64エンコードされた動画データ
	 * @returns Promise<{duration: number, width: number, height: number}>
	 */
	const getVideoMetadata = async (
		base64Video: string,
	): Promise<{ duration: number, width: number, height: number }> => {
		return new Promise((resolve, reject) => {
			const video = document.createElement('video')
			video.crossOrigin = 'anonymous'
			video.muted = true
			video.playsInline = true

			video.onloadedmetadata = () => {
				const metadata = {
					duration: video.duration,
					width: video.videoWidth,
					height: video.videoHeight,
				}

				video.pause()
				video.src = ''
				video.load()

				resolve(metadata)
			}

			video.onerror = (error) => {
				reject(new Error(`Video loading error: ${error}`))
			}

			video.src = base64Video
			video.load()
		})
	}

	/**
	 * base64の動画ファイルから指定した時間位置のフレームをサムネイル画像として抽出する
	 * @param base64Video - base64エンコードされた動画データ
	 * @param timeInSeconds - 抽出する時間位置（秒）
	 * @param options - オプション設定
	 * @param options.quality - 画像の品質（0.0-1.0、デフォルト: 0.8）
	 * @param options.format - 画像フォーマット（デフォルト: 'image/jpeg'）
	 * @returns Promise<string> - base64エンコードされたサムネイル画像
	 */
	const extractThumbnailAtTime = async (
		base64Video: string,
		timeInSeconds: number,
		options: {
			quality?: number
			format?: 'image/jpeg' | 'image/png' | 'image/webp'
		} = {},
	): Promise<string> => {
		const {
			quality = 0.8,
			format = 'image/jpeg',
		} = options

		return new Promise((resolve, reject) => {
			// Video要素を作成
			const video = document.createElement('video')
			video.crossOrigin = 'anonymous'
			video.muted = true
			video.playsInline = true

			// Canvas要素を作成
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			if (!ctx) {
				reject(new Error('Canvas context could not be created'))
				return
			}

			// 指定した時間位置のフレームをキャプチャする関数
			const captureFrameAtTime = () => {
				try {
					// 指定した時間位置にシーク
					video.currentTime = timeInSeconds

					// シーク完了後にフレームをキャプチャ
					setTimeout(() => {
						try {
							// Canvasのサイズを設定
							canvas.width = video.videoWidth
							canvas.height = video.videoHeight

							// 動画のフレームをCanvasに描画
							ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

							// Canvasからbase64画像を取得
							const thumbnailBase64 = canvas.toDataURL(format, quality)

							// リソースをクリーンアップ
							video.pause()
							video.src = ''
							video.load()

							resolve(thumbnailBase64)
						}
						catch (error) {
							reject(error)
						}
					}, 100) // シーク完了を待つ
				}
				catch (error) {
					reject(error)
				}
			}

			// 動画のメタデータが読み込まれたら処理開始
			video.onloadedmetadata = () => {
				// 指定した時間が動画の長さを超えていないかチェック
				if (timeInSeconds > video.duration) {
					reject(new Error(`指定した時間(${timeInSeconds}秒)が動画の長さ(${video.duration}秒)を超えています`))
					return
				}
				captureFrameAtTime()
			}

			video.onerror = (error) => {
				reject(new Error(`Video loading error: ${error}`))
			}

			// 動画を読み込み開始
			video.src = base64Video
			video.load()
		})
	}

	return {
		extractThumbnail,
		extractThumbnailAtTime,
		extractMultipleFrames,
		getVideoMetadata,
	}
}

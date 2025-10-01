/**
 * Video に関する関数をまとめたファイル
 */
import type { UIConfig } from '../../types'
import type { VideoConfig } from '../../types/video'
import { useState, useAppConfig, readonly } from '#imports'

export const useVideo = () => {
	const config = useState<VideoConfig | null>('ui-video-config', () => null)

	/**
	 * 初期化
	 */
	const init = () => {
		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		config.value = appConfig.video ?? null
	}

	/**
	 * 時間表示
	 */
	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	return {
		config: readonly(config),
		init,
		formatTime,
	}
}

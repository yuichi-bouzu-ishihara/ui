// VimeoPlayer の型定義

export type ReadyEvent = {
	duration: number // 秒数
	width: number // 動画の幅
	height: number // 動画の高さ
	ratio: number // 動画のアスペクト比
}

export type TimeUpdateEvent = {
	currentTime: number
}

export type VolumeChangeEvent = {
	volume: number
}

export type FullscreenChangeEvent = {
	fullscreen: boolean
}

export type QualityChangeEvent = {
	quality: string
}

export type TextTrackChangeEvent = {
	kind: string | null
	label: string | null
	language: string | null
}

export type CuePointEvent = {
	data: unknown
	id: string
	time: number
}

export type ChapterChangeEvent = {
	startTime: number
	title: string
}

export interface VimeoPlayerInstance {
	play: () => Promise<void>
	pause: () => Promise<void>
}

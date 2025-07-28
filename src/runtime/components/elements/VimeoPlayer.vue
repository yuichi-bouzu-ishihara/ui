<template>
	<Box v-resize="(r: DOMRectReadOnly) => rect = r" class="vimeoPlayer" :class="classes" :style="styles">
		<component :is="background ? 'div' : 'Ratio'"
			v-if="thumbnailUrl && (isEnded || !isReady || (currentTime === 0 && state === ''))" class="vimeoPlayer-thumbnail"
			:per="videoRatioHeight * 100">
			<Image class="vimeoPlayer-thumbnail-inner" :src="thumbnailUrl" cover />
		</component>
		<div ref="element" class="vimeoPlayer-main"
			:class="{ _ready: isReady, _play: state === 'play', _pause: state === 'pause', _ended: isEnded }" />
	</Box>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Player from '@vimeo/player'
import { useFetchClient } from '../../composables/fetch-client'

// Model --------------------------------------------------
const volume = defineModel<number>('volume', { default: 0.25 })
const mute = defineModel<boolean>('mute', { default: false })
const currentTime = defineModel<number>('currentTime', { default: 0 })
const seeking = defineModel<boolean>('seeking', { default: false })

// Props --------------------------------------------------
const props = defineProps({
	videoId: { type: [String, Number], required: true },
	background: { type: Boolean, default: false },
	thumbnailSrc: { type: String, default: '' },
	controller: { type: Boolean, default: false },
	width: { type: Number, default: 0 },
	height: { type: Number, default: 0 },
})

// Expose methods --------------------------------------------------
const play = async () => {
	if (vimeoPlayer) {
		try {
			await vimeoPlayer.play()
			onPlay()
		}
		catch (error: unknown) {
			console.error('Vimeo play error:', error)
		}
	}
}

const pause = async () => {
	if (vimeoPlayer) {
		try {
			await vimeoPlayer.pause()
			onPause()
		}
		catch (error: unknown) {
			console.error('Vimeo pause error:', error)
		}
	}
}

defineExpose({
	play,
	pause,
})

let vimeoPlayer: InstanceType<typeof Player> | null = null

// Emits --------------------------------------------------
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

const emit = defineEmits<{
	play: []
	pause: []
	ended: []
	error: []
	loaded: []
	bufferend: []
	bufferstart: []
	playbackratechange: []
	progress: []
	seeked: []
	timeupdate: [event?: TimeUpdateEvent]
	volumechange: [event?: VolumeChangeEvent]
	ready: [event: ReadyEvent]
}>()

// Data --------------------------------------------------
const element = ref(null)
const rect = ref<DOMRectReadOnly | null>(null)
const state = ref('')
const videoNativeWidth = ref(props.width)
const videoNativeHeight = ref(props.height)
const videoRatioHeight = ref(0)
const videoContainWidth = ref(0) // コンポーネントに収まる動画の幅
const videoContainHeight = ref(0) // コンポーネントに収まる動画の高さ
const videoCoverRatio = ref(0) // コンポーネントを埋める動画のアスペクト比
const thumbnailUrl = ref(props.thumbnailSrc) // サムネイルURL
const videoDuration = ref(0) // 動画の長さ
const isReady = ref(false) // 動画の準備が完了したかどうか
const isEnded = ref(false) // 動画が終了したかどうか
const isSeeking = ref(false) // 外部からのシーク操作中かどうか
const previousState = ref('') // 前回のstate

// Computed -----------------------------------------------
const classes = computed(() => {
	return {
		[`_${state.value}`]: true,
		_background: props.background,
	}
})
const styles = computed(() => {
	if (!rect.value) {
		return {}
	}

	return {
		'--vimeoPlayer-ratio': `${videoCoverRatio.value}`,
		'--vimeoPlayer-width': `${videoContainWidth.value * videoCoverRatio.value}px`,
		'--vimeoPlayer-height': `${videoContainHeight.value * videoCoverRatio.value}px`,
		...(!props.background
			? {
				paddingTop: `${videoRatioHeight.value * 100}%`,
			}
			: {}),
	}
})

// Methods ------------------------------------------------
const onBufferEnd = async () => {
	// console.log('Buffer end')
	// state.value = 'bufferend'
	emit('bufferend')
}
const onBufferStart = async () => {
	// console.log('Buffer start')
	// state.value = 'bufferstart'
	emit('bufferstart')
}
const onEnded = async () => {
	// console.log('Ended')
	state.value = 'ended'
	isEnded.value = true
	emit('ended')
}
const onError = async () => {
	// console.log('Error')
	state.value = 'error'
	emit('error')
}
const onLoaded = async () => {
	// console.log('Loaded')
	// state.value = 'loaded'
	emit('loaded')

	// 動画の準備が完了したらreadyイベントをemit
	if (!isReady.value) {
		try {
			const duration = await vimeoPlayer.getDuration()
			videoDuration.value = duration
			isReady.value = true
			emit('ready', {
				duration: videoDuration.value,
				width: videoNativeWidth.value,
				height: videoNativeHeight.value,
				ratio: videoRatioHeight.value,
			})
		}
		catch (error: unknown) {
			console.error('Vimeo duration error:', error)
		}
	}
}
const onPause = async () => {
	// console.log('Pause')
	state.value = 'pause'
	emit('pause')
}
const onPlay = async () => {
	// console.log('Play')
	state.value = 'play'
	isEnded.value = false
	updateVideoSize()
}
const onPlayBackRateChange = async () => {
	// console.log('Playbackrate change')
	// state.value = 'playbackratechange'
	emit('playbackratechange')
}
const onProgress = async () => {
	// console.log('progress')
	// state.value = 'progress'
	emit('progress')
}
const onSeeked = async () => {
	// console.log('Seeked')
	// state.value = 'seeked'
	emit('seeked')
}
const onTimeUpdate = async () => {
	// console.log('Time update')
	// state.value = 'timeupdate'
	try {
		const time = await vimeoPlayer.getCurrentTime()
		// シーク操作中でない場合のみcurrentTimeを更新
		if (!isSeeking.value) {
			currentTime.value = time
		}
		emit('timeupdate', { currentTime: time })
	}
	catch (error: unknown) {
		console.error('Vimeo current time error:', error)
		emit('timeupdate')
	}
}
const onVolumeChange = async () => {
	// console.log('Volume change')
	// state.value = 'volumechange'
	try {
		const volume = await vimeoPlayer.getVolume()
		emit('volumechange', { volume })
	}
	catch (error: unknown) {
		console.error('Vimeo volume error:', error)
		emit('volumechange')
	}
}
// 動画の縦横サイズを取得する
const getVideoSize = async () => {
	try {
		const dimensions = await Promise.all([vimeoPlayer.getVideoWidth(), vimeoPlayer.getVideoHeight()])
		const width = dimensions[0]
		const height = dimensions[1]
		videoNativeWidth.value = width
		videoNativeHeight.value = height
		videoRatioHeight.value = height / width
	}
	catch (error: unknown) {
		console.error('Vimeo video size error:', error)
	}
}
const updateVideoSize = () => {
	if (!rect.value || !videoRatioHeight.value) return

	const r = rect.value
	videoContainHeight.value = r.height
	// console.log(r.height, videoRatioHeight.value)
	if (videoRatioHeight.value < 1) {
		videoContainWidth.value = r.height / videoRatioHeight.value
	}
	else {
		videoContainWidth.value = r.height * videoRatioHeight.value
	}

	videoCoverRatio.value = Math.max(r.width / videoContainWidth.value, r.height / videoContainHeight.value)
}

// コントローラーの表示/非表示を切り替える
const updateController = async () => {
	// if (props.background) {
	// 	return
	// }

	// if (vimeoPlayer) {
	// 	try {
	// 		await vimeoPlayer.setControls(props.controller)
	// 	}
	// 	catch (error: unknown) {
	// 		console.error('Vimeo controller update error:', error)
	// 	}
	// }
}

// Watchers ------------------------------------------------
watch(
	() => props.videoId,
	(newVideoId) => {
		// 新しい動画がロードされる際にready状態をリセット
		isReady.value = false
		isEnded.value = false
		videoDuration.value = 0

		vimeoPlayer
			.loadVideo(newVideoId)
			.then(() => {
				// 動画のロードが成功した後の処理
			})
			.catch((error: unknown) => {
				console.error('Vimeo video loading error:', error)
			})
	},
)
watch(
	() => rect.value,
	() => {
		updateVideoSize()
	},
	{
		deep: true,
		immediate: true,
	},
)
watch(
	() => props.controller,
	() => {
		updateController()
	},
)

watch(
	() => volume.value,
	async (newVolume) => {
		if (vimeoPlayer) {
			try {
				// mute中の場合、mute状態を再設定して確実に音を止める
				if (!mute.value) {
					await vimeoPlayer.setVolume(newVolume)
				}
			}
			catch (error: unknown) {
				console.error('Vimeo volume update error:', error)
			}
		}
	},
)

watch(
	() => mute.value,
	(newMute) => {
		if (vimeoPlayer) {
			vimeoPlayer.setMuted(newMute).catch((error: unknown) => {
				console.error('Vimeo mute update error:', error)
			})
			if (!newMute) {
				vimeoPlayer.setVolume(volume.value)
			}
		}
	},
)

watch(
	() => currentTime.value,
	async (nv) => {
		if (Number.isNaN(nv)) {
			currentTime.value = 0
			return
		}
		if (vimeoPlayer) {
			// シーク操作中のみsetCurrentTimeを実行
			if (seeking.value) {
				try {
					await vimeoPlayer.setCurrentTime(nv)
				}
				catch (error: unknown) {
					console.error('Vimeo seek error:', error)
				}
			}
		}
	},
)

watch(
	() => seeking.value,
	async (newSeeking, oldSeeking) => {
		if (vimeoPlayer) {
			if (newSeeking) {
				previousState.value = state.value
				pause()
			}
			// シーク操作中でない場合のみsetCurrentTimeを実行
			if (!newSeeking && oldSeeking) {
				try {
					if (previousState.value === 'play') {
						play()
					}
				}
				catch (error: unknown) {
					console.error('Vimeo seek error:', error)
				}
			}
		}
	},
)

// Lifecycle Hooks ----------------------------------------
onMounted(async () => {
	if (!props.thumbnailSrc) {
		// サムネイル取得
		const res = await useFetchClient().request(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${props.videoId}&width=1920&t=${Date.now()}`, { method: 'GET' })
		if ('thumbnail_url' in res) {
			thumbnailUrl.value = res.thumbnail_url
		}
	}

	vimeoPlayer = new Player(element.value, {
		id: props.videoId,
		background: props.background,
		controls: props.controller,
		// ローディングスピナーを非表示にするオプション
		showTitle: false,
		showPortrait: false,
		showByline: false,
		autopause: false,
		// ローディング中の表示を制御
		loading: 'lazy',
		// プレイヤーの外観を制御
		transparent: true,
		// ローディングスピナーを非表示にするための追加オプション
		playsinline: true,
	})
	// console.log(vimeoPlayer)
	await getVideoSize()
	await updateVideoSize()
	await updateController()
	vimeoPlayer.on('bufferend', onBufferEnd)
	vimeoPlayer.on('bufferstart', onBufferStart)
	vimeoPlayer.on('ended', onEnded)
	vimeoPlayer.on('error', onError)
	vimeoPlayer.on('loaded', onLoaded)
	vimeoPlayer.on('pause', onPause)
	vimeoPlayer.on('play', onPlay)
	vimeoPlayer.on('playbackratechange', onPlayBackRateChange)
	vimeoPlayer.on('progress', onProgress)
	vimeoPlayer.on('seeked', onSeeked)
	vimeoPlayer.on('timeupdate', onTimeUpdate)
	vimeoPlayer.on('volumechange', onVolumeChange)

	// 初期音量を設定
	await vimeoPlayer.setVolume(volume.value)

	// 初期mute状態を設定
	await vimeoPlayer.setMuted(mute.value)

	// mute中の場合、mute状態を再設定して確実に音を止める
	if (mute.value) {
		await vimeoPlayer.setMuted(true)
	}

	await vimeoPlayer.setCurrentTime(0)
})
onBeforeUnmount(() => {
	if (vimeoPlayer) {
		vimeoPlayer.off('bufferend', onBufferEnd)
		vimeoPlayer.off('bufferstart', onBufferStart)
		vimeoPlayer.off('ended', onEnded)
		vimeoPlayer.off('error', onError)
		vimeoPlayer.off('loaded', onLoaded)
		vimeoPlayer.off('pause', onPause)
		vimeoPlayer.off('play', onPlay)
		vimeoPlayer.off('playbackratechange', onPlayBackRateChange)
		vimeoPlayer.off('progress', onProgress)
		vimeoPlayer.off('seeked', onSeeked)
		vimeoPlayer.off('timeupdate', onTimeUpdate)
		vimeoPlayer.off('volumechange', onVolumeChange)
		vimeoPlayer.destroy()
	}
})

// コンポーネントの型定義
export interface VimeoPlayerInstance {
	play: () => Promise<void>
	pause: () => Promise<void>
}
</script>

<style lang="scss">
@use "../../scss/_variables.scss" as var;
@use "../../scss/_mixins.scss" as mix;
@use "../../scss/_functions.scss" as func;
$cn: '.vimeoPlayer'; // コンポーネントクラス名

#{$cn} {
	position: relative;
	z-index: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;

	&._background {
		width: 100%;
		height: 100%;

		#{$cn}-main {
			transition: var.$transition-base;
			transition-duration: 500ms;
			opacity: 0;

			iframe {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: var(--vimeoPlayer-width);
				height: var(--vimeoPlayer-height);
			}
		}

		&._play #{$cn}-main {
			opacity: 1;
		}
	}

	&._play {
		#{$cn}-thumbnail {
			opacity: 0;
		}
	}

	&._ended {
		#{$cn}-thumbnail {
			opacity: 1;
		}
	}

	&-thumbnail {
		position: absolute;
		inset: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
	}

	&-main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;

		iframe {
			width: 100%;
			height: 100%;
		}

		&._ready._play,
		&._ready._pause {
			opacity: 1;
		}

		&._ended {
			opacity: 0;
		}
	}
}
</style>

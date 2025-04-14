<template>
	<Box v-resize="(r: DOMRectReadOnly) => rect = r" class="vimeoPlayer" :class="classes" :style="styles">
		<Box v-if="thumbnailUrl" class="vimeoPlayer-thumbnail">
			<Image class="vimeoPlayer-thumbnail-inner" :src="thumbnailUrl" cover />
		</Box>
		<div ref="element" class="vimeoPlayer-main" :style="ratioStyles" />
	</Box>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Player from '@vimeo/player'
import Box from '../layout/Box.vue'

let vimeoPlayer: Player | null = null

// Props --------------------------------------------------
const props = defineProps({
	videoId: { type: [String, Number], required: true },
	background: { type: Boolean, default: false }, // Whether the player is in background mode, which hides the playback controls, enables autoplay, and loops the video.
	thumbnailUrl: { type: String, default: '' }, // サムネイルURL
})

// Emits --------------------------------------------------
const emit = defineEmits(['play', 'pause', 'ended', 'error', 'loaded', 'bufferend', 'bufferstart', 'playbackratechange', 'progress', 'seeked', 'timeupdate', 'volumechange'])

// Data --------------------------------------------------
const element = ref(null)
const rect = ref<DOMRectReadOnly | null>(null)
const state = ref('')
const videoNativeWidth = ref(0)
const videoNativeHeight = ref(0)
const videoRatioHeight = ref(0)
const videoContainWidth = ref(0) // コンポーネントに収まる動画の幅
const videoContainHeight = ref(0) // コンポーネントに収まる動画の高さ
const videoCoverRatio = ref(0) // コンポーネントを埋める動画のアスペクト比

// Computed -----------------------------------------------
const classes = computed(() => {
	return {
		_background: props.background,
		[`_${state.value}`]: true,
	}
})
const styles = computed(() => {
	if (!rect.value) {
		return {}
	}

	if (props.background) {
		return {
			'--vimeoPlayer-ratio': `${videoCoverRatio.value}`,
			'--vimeoPlayer-width': `${videoContainWidth.value * videoCoverRatio.value}px`,
			'--vimeoPlayer-height': `${videoContainHeight.value * videoCoverRatio.value}px`,
		}
	}
	else {
		return {}
	}
})
const ratioStyles = computed(() => {
	if (!props.background) {
		return {
			paddingTop: `${videoRatioHeight.value * 100}%`,
		}
	}
	else {
		return {}
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
	// state.value = 'ended'
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
}
const onPause = async () => {
	// console.log('Pause')
	state.value = 'pause'
	emit('pause')
}
const onPlay = async () => {
	// console.log('Play')
	state.value = 'play'
	emit('play')
	updateVideoSize()
}
const onPlayBackRateChange = async () => {
	// console.log('Playbackrate change')
	// state.value = 'playbackratechange'
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
	emit('timeupdate')
}
const onVolumeChange = async () => {
	// console.log('Volume change')
	// state.value = 'volumechange'
	emit('volumechange')
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
	if (!rect.value) return

	const r = rect.value
	let minRatio = '' // w or h
	if (r.width < r.height) {
		if (videoNativeWidth.value > videoNativeHeight.value) {
			minRatio = 'w'
		}
		else {
			minRatio = 'h'
		}
	}
	else {
		if (videoNativeWidth.value > videoNativeHeight.value) {
			minRatio = 'h'
		}
		else {
			minRatio = 'w'
		}
	}

	if (!props.background) {
		if (minRatio === 'w') {
			videoContainHeight.value = r.height
			if (videoRatioHeight.value < 1) {
				videoContainWidth.value = r.height / videoRatioHeight.value
			}
			else {
				videoContainWidth.value = r.height * videoRatioHeight.value
			}
		}
		else {
			videoContainWidth.value = r.width
			if (videoRatioHeight.value < 1) {
				videoContainHeight.value = r.width / videoRatioHeight.value
			}
			else {
				videoContainHeight.value = r.width * videoRatioHeight.value
			}
		}
		videoCoverRatio.value = Math.max(r.width / videoContainWidth.value, r.height / videoContainHeight.value)
	}
	else {
		const r = rect.value
		videoContainHeight.value = r.height
		if (videoRatioHeight.value < 1) {
			videoContainWidth.value = r.height / videoRatioHeight.value
		}
		else {
			videoContainWidth.value = r.height * videoRatioHeight.value
		}

		videoCoverRatio.value = Math.max(r.width / videoContainWidth.value, r.height / videoContainHeight.value)
	}
}

// Watchers ------------------------------------------------
watch(
	() => props.videoId,
	(newVideoId) => {
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

// Lifecycle Hooks ----------------------------------------
onMounted(async () => {
	// 情報取得
	// const res = await useFetchClient().request(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${props.videoId}&width=1920&t=${Date.now()}`, { method: 'GET' })
	// if ('thumbnail_url' in res) {
	// 	thumbnailUrl.value = res.thumbnail_url
	// }

	vimeoPlayer = new Player(element.value, {
		id: props.videoId,
		background: props.background,
	})
	await getVideoSize()
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
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.vimeoPlayer'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		user-select: none;

		&-thumbnail {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
		}

		&-main {
			position: relative;
			width: 100%;
			// opacity: 0;
			overflow: hidden;

			iframe {
				position: absolute;
				inset: 0;
				width: 100%;
				height: 100%;
			}
		}

		&._background {
			width: 100%;
			height: 100%;

			#{$cn}-main {
				width: 100%;
				height: 100%;
				transition: var.$transition-base;

				iframe {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: var(--vimeoPlayer-width);
					height: var(--vimeoPlayer-height);
				}
			}
		}

		&._play {
			#{$cn}-main {
				opacity: 1;
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

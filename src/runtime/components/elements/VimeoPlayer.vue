<template>
	<Box v-resize="(r: DOMRectReadOnly) => rect = r" class="vimeoPlayer" :class="classes" :style="styles">
		<div ref="element" class="vimeoPlayer-main" :style="ratioStyles" />
	</Box>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Player from '@vimeo/player'
import Box from '../layout/Box.vue'

// Props --------------------------------------------------
const props = defineProps({
	videoId: { type: [String, Number], required: true },
	background: { type: Boolean, default: false }, // Whether the player is in background mode, which hides the playback controls, enables autoplay, and loops the video.
})

let vimeoPlayer: Player | null = null

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
}
const onBufferStart = async () => {
	// console.log('Buffer start')
	// state.value = 'bufferstart'
}
const onEnded = async () => {
	// console.log('Ended')
	// state.value = 'ended'
}
const onError = async () => {
	// console.log('Error')
	state.value = 'error'
}
const onLoaded = async () => {
	// console.log('Loaded')
	// state.value = 'loaded'
}
const onPause = async () => {
	// console.log('Pause')
	state.value = 'pause'
}
const onPlay = async () => {
	// console.log('Play')
	state.value = 'play'
	updateVideoSize()
}
const onPlayBackRateChange = async () => {
	// console.log('Playbackrate change')
	// state.value = 'playbackratechange'
}
const onProgress = async () => {
	// console.log('progress')
	// state.value = 'progress'
}
const onSeeked = async () => {
	// console.log('Seeked')
	// state.value = 'seeked'
}
const onTimeUpdate = async () => {
	// console.log('Time update')
	// state.value = 'timeupdate'
}
const onVolumeChange = async () => {
	// console.log('Volume change')
	// state.value = 'volumechange'
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
	catch (error: any) {
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

// Watchers ------------------------------------------------
watch(
	() => props.videoId,
	(newVideoId) => {
		vimeoPlayer
			.loadVideo(newVideoId)
			.then(() => {
				// 動画のロードが成功した後の処理
			})
			.catch((error: any) => {
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
		&-main {
			position: relative;
			width: 100%;
			overflow: hidden;
		}

		&._background {
			width: 100%;
			height: 100%;

			#{$cn}-main {
				width: 100%;
				height: 100%;
				opacity: 0;
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

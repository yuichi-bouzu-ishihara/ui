<template>
	<Box class="videoPlayer" w="100%" relative z-index="0" @mouseover="isHover = true" @mouseleave="isHover = false">
		<Ratio wide-screen>
			<Box class="videoPlayer-bg" absolute top="0" left="0" w="100%" h="100%" z-index="-1">
				<!-- <template v-if="thumbnail">
					<Image class="videoPlayer-thumbnail" :src="thumbnail" cover />
					<div class="videoPlayer-filter" />
				</template> -->
			</Box>
			<video ref="player" class="videoPlayer-video" v-bind="{ src, autoplay, volume, muted }" @loadedmetadata="onReady"
				@play="onPlay" @pause="onPause" @ended="onEnded" @error="onError" @timeupdate="onTimeUpdate" />
			<Image v-if="thumbnail && currentTime === 0" class="videoPlayer-thumbnail" :src="thumbnail" contain />
			<TransitionFade v-if="shouldShowControls">
				<Box v-if="alwaysShowControls || isHover" absolute top="0" left="0" w="100%" h="100%" z-index="0">
					<VideoPlayerControls v-model:volume="volume" v-model:current-time="currentTime" v-model:seeking="seeking"
						v-bind="{ duration, isPlaying, isBuffering, muted, enabledControls }" class="videoPlayer-controls"
						@play="play" @pause="pause" />
				</Box>
			</TransitionFade>
			<Box v-if="isBuffering" absolute top="0" left="0" w="100%" h="100%" z-index="1">
				<Center>
					<Spinner size="40" color="light" />
				</Center>
			</Box>
		</Ratio>
	</Box>
</template>

<script setup lang="ts">
import { ref, watch, computed, type PropType } from '#imports'
import VideoPlayerControls from './VideoPlayerControls.vue'
import { useVideo } from '../../composables/elements/video'

// Composables --------------
const { config } = useVideo()

// Model --------------------------------------------------
const muted = defineModel<boolean>('muted', { default: false })
const currentTime = defineModel<number>('current-time', { default: 0 })

// Props --------------
const props = defineProps({
	src: { type: String, required: true },
	thumbnail: { type: String, default: '' },
	autoplay: { type: Boolean, default: false },
	controls: { type: [Boolean, Array] as PropType<boolean | string[]>, default: false },
	alwaysShowControls: { type: Boolean, default: false }, // コントロールを常に表示するかどうか
})

// Data --------------
const isPlaying = ref(false)
const isError = ref(false)
const isHover = ref(false)
const isReady = ref(false)
const isBuffering = ref(false)
const duration = ref(0)
const progress = ref(0)
const volume = ref(config.value?.defaultVolume || 0.5)
const player = ref<HTMLVideoElement>()
const seeking = ref(false)

// Computed --------------
const enabledControls = computed(() => {
	if (props.controls === true) {
		return ['play', 'time', 'volume', 'seekbar']
	}
	if (props.controls === false) {
		return []
	}
	return props.controls
})

const shouldShowControls = computed(() => {
	return props.controls !== false && enabledControls.value.length > 0
})

// Methods --------------
const onReady = (e: Event) => {
	const video = e.target as HTMLVideoElement
	duration.value = video.duration
	isReady.value = true
}

const onPlay = () => {
	isPlaying.value = true
}

const onPause = () => {
	isPlaying.value = false
}

const onTimeUpdate = (e: Event) => {
	if (seeking.value) return
	const video = e.target as HTMLVideoElement
	currentTime.value = video.currentTime
	progress.value = (currentTime.value / duration.value)
}

const onEnded = () => {
	isPlaying.value = false
}

const onError = () => {
	isError.value = true
}

const play = () => {
	player.value?.play()
	onPlay()
}

const pause = () => {
	player.value?.pause()
	onPause()
}

// Watchers --------------
watch(currentTime, (time) => {
	if (seeking.value && player.value) {
		player.value.currentTime = time
	}
})
</script>

<style lang="scss">
$cn: '.videoPlayer';

#{$cn} {
	&-bg {
		background-color: black;
	}

	&-video {
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	&-thumbnail {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	&-filter {
		position: absolute;
		inset: 0;
		z-index: 0;
		background-color: var(--color-background-060);
		backdrop-filter: blur(40px);
	}

	&-controls {
		width: 100%;
		height: 100%;
	}
}
</style>

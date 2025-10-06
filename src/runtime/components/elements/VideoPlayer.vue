<template>
	<Box class="videoPlayer" w="100%" relative z-index="0" @mouseover="isHover = true" @mouseleave="isHover = false">
		<Ratio :per="9 / 16 * 100">
			<Box class="videoPlayer-bg" absolute top="0" left="0" w="100%" h="100%" z-index="-1">
				<Image v-if="thumbnail" class="videoPlayer-thumbnail" :src="thumbnail" cover />
			</Box>
			<div class="videoPlayer-filter" />
			<video ref="player" class="videoPlayer-video" :src="src" :autoplay="autoplay" :volume="volume" :muted="isMuted"
				@loadedmetadata="onReady" @play="onPlay" @pause="onPause" @ended="onEnded" @error="onError"
				@timeupdate="onTimeUpdate" />
			<Image v-if="thumbnail && currentTime === 0" class="videoPlayer-thumbnail" :src="thumbnail" contain />
			<TransitionFade v-if="controls">
				<Box v-if="isHover" absolute top="0" left="0" w="100%" h="100%" z-index="0">
					<VideoPlayerControls v-model:mute="isMuted" v-model:volume="volume" v-model:current-time="currentTime"
						v-bind="{ duration, isPlaying, isBuffering }" class="videoPlayer-controls" @play="play" @pause="pause"
						@mute="onMute" />
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
import { ref } from '#imports'
import VideoPlayerControls from './VideoPlayerControls.vue'
import { useVideo } from '../../composables/elements/video'

// Composables --------------
const { config } = useVideo()

// Props --------------
const props = defineProps({
	src: { type: String, required: true },
	thumbnail: { type: String, default: '' },
	autoplay: { type: Boolean, default: false },
	mute: { type: Boolean, default: false },
	controls: { type: Boolean, default: false },
})

// Data --------------
const isPlaying = ref(false)
const isError = ref(false)
const isHover = ref(false)
const isReady = ref(false)
const isBuffering = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const isMuted = ref(props.mute || false)
const volume = ref(config.value?.defaultVolume || 0.5)
const player = ref<HTMLVideoElement>()

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

const onMute = () => {
	if (player.value) {
		isMuted.value = !isMuted.value
	}
}
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

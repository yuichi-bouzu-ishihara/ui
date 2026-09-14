<template>
	<Box class="videoPlayer" :class="classes" w="100%" relative z-index="0" @mouseover="isHover = true"
		@mouseleave="isHover = false">
		<!-- cover / background では親の大きさいっぱいに敷くため Ratio を通さない。 -->
		<component :is="fill ? 'div' : Ratio" class="videoPlayer-frame" v-bind="fill ? {} : { wideScreen: true }">
			<Box class="videoPlayer-bg" absolute top="0" left="0" w="100%" h="100%" z-index="-1" />
			<video ref="player" class="videoPlayer-video" v-bind="{ src, autoplay, volume, muted, loop, preload }"
				:playsinline="playsinline || undefined" :webkit-playsinline="playsinline || undefined" @loadedmetadata="onReady"
				@play="onPlay" @pause="onPause" @ended="onEnded" @error="onError" @timeupdate="onTimeUpdate" />
			<Image v-if="thumbnail && currentTime === 0" class="videoPlayer-thumbnail" :src="thumbnail" :cover="cover"
				:contain="!cover" />
			<TransitionFade v-if="shouldShowControls">
				<Box v-if="alwaysShowControls || isHover" absolute top="0" left="0" w="100%" h="100%" z-index="0">
					<VideoPlayerControls v-model:volume="volume" v-model:current-time="currentTime" v-model:seeking="seeking"
						v-bind="{ duration, isPlaying, isBuffering, muted, enabledControls }" class="videoPlayer-controls"
						@play="play" @pause="pause" />
				</Box>
			</TransitionFade>
			<Box v-if="!background && isBuffering" absolute top="0" left="0" w="100%" h="100%" z-index="1">
				<Center>
					<Spinner size="40" color="light" />
				</Center>
			</Box>
		</component>
	</Box>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount, type PropType } from '#imports'
import VideoPlayerControls from './VideoPlayerControls.vue'
import Ratio from '../layout/Ratio.vue'
import { useVideo } from '../../composables/elements/video'
import { useVideoAutopause } from '../../composables/elements/video-autopause'

// Composables --------------
const { config } = useVideo()
const { register, notifyPlay } = useVideoAutopause()

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
	loop: { type: Boolean, default: false }, // ループ再生のオプション
	cover: { type: Boolean, default: false }, // 親の大きさいっぱいに敷き、はみ出た分を切る
	background: { type: Boolean, default: false }, // 装飾用途。コントロールとスピナーを出さない
	// 他のプレイヤーが再生されたら自動的に停止するオプション。
	// VimeoPlayer は既定 true だが、こちらは既定 false にしている。
	// 従来は複数同時再生ができたため、既定を変えると既存の利用箇所の挙動が変わってしまう。
	autopause: { type: Boolean, default: false },
	// iOS でインライン再生する。false にすると再生時に全画面へ遷移し、
	// 自動再生やループ背景としての利用ができなくなる。
	playsinline: { type: Boolean, default: true },
	preload: {
		type: String,
		default: 'metadata',
		validator: (value: string) => ['none', 'metadata', 'auto'].includes(value),
	},
})

// Emits --------------
const emit = defineEmits<{
	play: []
	pause: []
	ended: []
	error: []
}>()

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
	// background は装飾用途なのでコントロールを出さない。
	return !props.background && props.controls !== false && enabledControls.value.length > 0
})

/** Ratio を通さず親の大きさいっぱいに敷くかどうか。 */
const fill = computed(() => props.cover || props.background)

const classes = computed(() => {
	return {
		_cover: props.cover,
		_background: props.background,
		_fill: fill.value,
	}
})

// Methods --------------
const onReady = (e: Event) => {
	const video = e.target as HTMLVideoElement
	duration.value = video.duration
	isReady.value = true
}

/** 他のプレイヤーが再生したときに呼ばれる停止処理。登録簿へ渡す実体。 */
const pauseByOther = () => {
	player.value?.pause()
}

const onPlay = () => {
	isPlaying.value = true
	// autopause を有効にした他のプレイヤーを止める。自分は対象から外す。
	notifyPlay(pauseByOther)
	emit('play')
}

const onPause = () => {
	isPlaying.value = false
	emit('pause')
}

const onTimeUpdate = (e: Event) => {
	if (seeking.value) return
	const video = e.target as HTMLVideoElement
	currentTime.value = video.currentTime
	progress.value = (currentTime.value / duration.value)
}

const onEnded = () => {
	isPlaying.value = false
	emit('ended')
}

const onError = () => {
	isError.value = true
	emit('error')
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

// autopause の登録・解除 --------------
let disposeAutopause: (() => void) | undefined

const syncAutopause = () => {
	disposeAutopause?.()
	disposeAutopause = undefined
	if (props.autopause) {
		disposeAutopause = register(pauseByOther)
	}
}

watch(() => props.autopause, syncAutopause, { immediate: true })

onBeforeUnmount(() => {
	disposeAutopause?.()
	disposeAutopause = undefined
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

	// Ratio を通さない場合。親の大きさをそのまま使う。
	&._fill {
		height: 100%;
	}

	&._fill #{$cn}-frame {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	&._fill #{$cn}-video {
		position: absolute;
		inset: 0;
	}

	&._cover #{$cn}-video {
		object-fit: cover;
	}
}
</style>

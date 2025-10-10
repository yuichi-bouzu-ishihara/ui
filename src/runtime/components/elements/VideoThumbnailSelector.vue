<template>
	<div class="videoThumbnailSelector">
		<video v-if="video" ref="videoRef" v-resize="(rect: DOMRectReadOnly) => width = rect.width" :src="video"
			:currentTime="isValidTime ? selectedTime : undefined" contain @loadedmetadata="onLoadedMetadata"
			@canplaythrough="onCanPlayThrough" @seeked="onSeeked" @timeupdate="onTimeUpdate" />
		<Box absolute top="0" left="0" :w="width" h="100%" color="rgba(0, 0, 0, 0.1)">
			<Center v-if="!isLoaded || (isGenerating && tryCount > 0)">
				<Column justify="center" gap="10">
					<Spinner />
				</Column>
			</Center>
			<Center v-if="error">
				<Column justify="center" gap="10">
					<Icon name="exclamationCircle" size="32" color="danger" />
					<Typography color="danger" caption1 bold>
						{{ error }}
					</Typography>
				</Column>
			</Center>
			<Box absolute bottom="0" left="0" right="0" m="auto" w="100%" p="0 20px 24px">
				<InputRange v-if="isLoaded" v-model="selectedTime" min="0" :max="duration" :step="step"
					:color="{ handle: 'var(--color-light)', bar: 'var(--color-light)', barBackground: 'var(--color-light-020)' }"
					@mousedown="isSelectingTime = true" @mouseup="isSelectingTime = false" />
			</Box>
		</Box>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useVideoThumbnail } from '../../composables/elements/video-thumbnail'
import { useDebounce } from '../../composables/debounce'
import { useUtils } from '../../composables/utils'
import InputRange from '../forms/InputRange.vue'
import Box from '../layout/Box.vue'
import Center from '../layout/Center.vue'
import Column from '../layout/Column.vue'
import Icon from '../elements/Icon.vue'
import Typography from '../elements/Typography.vue'
import Spinner from '../elements/Spinner.vue'

// Constants ------------------
const MAX_TRY_COUNT = 5
const FRAME_RATE = 30

// Composables ------------------
const { extractThumbnailAtTime } = useVideoThumbnail()

// Model ------------------
const selectedTime = defineModel<number>('selected-time', { default: 0 })

// Props --------------------------------
const props = defineProps({
	// base64エンコードされた動画データ
	video: { type: String, required: true },
})
// Emits ------------------
const emit = defineEmits(['generated-thumbnail', 'error', 'processing'])

// Data ------------------
const videoRef = ref<HTMLVideoElement | null>(null)
const error = ref('')
const isLoaded = ref(false)
const isGenerating = ref(false)
const thumbnailBase64 = ref('')
const progress = ref(0)
const duration = ref(0)
const tryCount = ref(0)
const isSelectingTime = ref(false)
const seekedTime = ref(0)
const width = ref(0)

// Computed ------------------
const isValidTime = computed(() => {
	return !Number.isNaN(selectedTime.value) && selectedTime.value >= 0
})
const step = computed(() => {
	return duration.value / FRAME_RATE
})

// Methods ------------------
const generateThumbnailInternal = useDebounce(async () => {
	isGenerating.value = true
	emit('processing', true)
	try {
		thumbnailBase64.value = await extractThumbnailAtTime(props.video, selectedTime.value, {
			quality: 1.0,
			format: 'image/webp',
		})
		if (!thumbnailBase64.value.length && tryCount.value < MAX_TRY_COUNT) {
			tryCount.value++
			await nextTick()
			await useUtils().wait(100)
			await generateThumbnailInternal()
		}
		else if (!thumbnailBase64.value.length && tryCount.value >= MAX_TRY_COUNT) {
			tryCount.value = 0
			emit('error', 'サムネイル生成エラー')
			throw new Error('サムネイル生成エラー')
		}
		else {
			emit('generated-thumbnail', thumbnailBase64.value)
		}
	}
	catch (err) {
		error.value = `${err}`
	}
	isGenerating.value = false
	emit('processing', false)
}, 1000)
const generate = async () => {
	generateThumbnailInternal()
}

const onLoadedMetadata = (event: Event) => {
	duration.value = (event.target as HTMLVideoElement).duration
	// selectedTimeがNaNの場合は0を使用
	if (Number.isNaN(selectedTime.value)) {
		selectedTime.value = 0
	}
	progress.value = selectedTime.value / duration.value || 0
}

const onCanPlayThrough = (_event: Event) => {
	isLoaded.value = true
}

const onSeeked = async (event: Event) => {
	seekedTime.value = (event.target as HTMLVideoElement).currentTime
}
const onTimeUpdate = async (event: Event) => {
	seekedTime.value = (event.target as HTMLVideoElement).currentTime
}

// selectedTimeの変更を監視して動画の再生ヘッドを移動
watch(() => selectedTime.value, (newTime) => {
	if (videoRef.value && !Number.isNaN(newTime) && newTime >= 0) {
		videoRef.value.currentTime = newTime
	}
})
watch(() => isSelectingTime.value, async (nv) => {
	// 動画の再生ヘッドが指定位置に移動完了した時
	if (!nv) {
		// サムネイル生成が待機中の場合は実行
		await nextTick()
		await generate()
	}
})
</script>

<style lang="scss">
$cn: '.videoThumbnailSelector'; // コンポーネントクラス名

#{$cn} {
	position: relative;
	display: flex;
	justify-content: center;
	max-width: 100%;
	max-height: 100%;
	background-color: black;

	video {
		max-width: 100%;
		max-height: 100%;
		vertical-align: top;
		object-fit: contain;
	}
}
</style>

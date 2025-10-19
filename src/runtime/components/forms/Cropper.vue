<template>
	<div ref="element" class="cropper" :class="classes" :style="{ width: '100%', height: `${trimHeight}px` }">
		<Box v-resize="(rect: DOMRectReadOnly) => onResize(rect)" class="cropper-trim" :w="trimWidth" :h="trimHeight">
			<div class="cropper-trim-img" :style="imageSizeStyle">
				<Image v-if="src" :key="`cropper-trim-img-count${imageChangeDate}`" :style="imageTransformStyle" :src="src"
					@ready="onImageReady" @error="emit('error')" />
			</div>
		</Box>
		<div v-if="src" ref="captureEl" class="cropper-capture"
			:style="`width: ${outputWidth || trimWidth}px; height: ${outputHeight || trimHeight}px; overflow: hidden;`">
			<div class="cropper-capture-img" :style="captureImageSizeStyle">
				<Image :src="src" :style="imageTransformStyle" />
			</div>
		</div>
		<div v-if="src" class="cropper-outside">
			<Draggable v-model="custom.position" style="width: 100%; height: 100%" calc>
				<Zoomable v-model="custom.scale" style="width: 100%; height: 100%" calc>
					<div class="cropper-outside-img" :style="imageSizeStyle">
						<Image :src="src" :style="imageTransformStyle" />
					</div>
				</Zoomable>
			</Draggable>
		</div>
		<template v-if="trimStyle === 'avatar'">
			<div class="cropper-dotted"
				:style="{ width: `${trimWidth + 4}px`, height: `${trimHeight + 4}px`, inset: `-${2}px` }" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Zoomable from '../gesture/Zoomable.vue'
import type { Position } from '../gesture/Draggable.vue'
import { useImage } from '../../composables/image'

// Types ---------------------
export type Value = {
	position: Position
	scale: number
}

// Composables ---------------------
const image = useImage()

// Emits ---------------------
const emit = defineEmits<{
	(e: 'update:modelValue', value: Value): void
	(e: 'ready' | 'error'): void
	(e: 'resize', size: { width: number, height: number }): void
}>()

// Expose ---------------------
const capture = async () => {
	if (captureEl.value) {
		return await image.elementCaptureBase64(captureEl.value)
	}
}
defineExpose({ capture })

// Props ---------------------
const props = defineProps({
	src: { type: String, default: '' },
	trimStyle: { type: String, default: 'rectangle' }, // トリムエリアの形状
	trimWidth: { type: Number, default: 100 }, // トリムエリアの横幅サイズ
	trimHeight: { type: Number, default: 100 }, // トリムエリアの縦幅サイズ
	outputWidth: { type: Number, default: 0 }, // 出力画像の横幅サイズ
	outputHeight: { type: Number, default: 0 }, // 出力画像の縦幅サイズ
	modelValue: { type: Object as () => Value, default: () => ({ position: { x: 0, y: 0 }, scale: 1 }) },
})

// Data ----------------------
const imageChangeDate = ref(0) // 画像変更日時
const imageWidth = ref(0)
const imageHeight = ref(0)
const element = ref<HTMLElement | null>(null)
const captureEl = ref<HTMLElement | null>(null)

// Computed ------------------
const classes = computed(() => {
	return {
		[`_${props.trimStyle}`]: true,
	}
})
const custom = computed({
	get: () => props.modelValue,
	set: (value: Value) => {
		emit('update:modelValue', value)
	},
})
// 画像エレメントのサイズを指定するスタイル
const imageSizeStyle = computed(() => {
	return {
		width: imageWidth.value + 'px',
		height: imageHeight.value + 'px',
	}
})
// キャプチャーエレメントのサイズを指定するスタイル
const captureImageSizeStyle = computed(() => {
	let ratio = 1
	const outputWidth = props.outputWidth || props.trimWidth
	const outputHeight = props.outputHeight || props.trimHeight
	if (outputWidth && outputHeight) {
		ratio = Math.max(outputWidth / imageWidth.value, outputHeight / imageHeight.value)
	}
	return {
		width: imageWidth.value * ratio + 'px',
		height: imageHeight.value * ratio + 'px',
	}
})
// 画像エレメントの位置とスケールを指定するスタイル
const imageTransformStyle = computed(() => {
	// 画像位置を相対的な位置指定のパーセントで指定する。
	// トリムサイズと出力サイズが違う場合にも対応するため。
	const xPercent = imageWidth.value ? (custom.value.position.x / imageWidth.value) * 100 : 0
	const yPercent = imageHeight.value ? (custom.value.position.y / imageHeight.value) * 100 : 0
	return {
		transform: `translateX(${xPercent}%) translateY(${yPercent}%) scale(${custom.value.scale})`,
	}
})

// Methods -------------------
const onImageReady = ({ naturalWidth, naturalHeight }: { naturalWidth: number, naturalHeight: number }) => {
	const width = naturalWidth
	const height = naturalHeight

	// 画像のアスペクト比に合わせてトリムエリアに収まるようにする
	const ratio = Math.max(props.trimWidth / width, props.trimHeight / height)

	imageWidth.value = width * ratio
	imageHeight.value = height * ratio
	custom.value.position = { x: 0, y: 0 }
	custom.value.scale = 1

	emit('ready')
}
// 位置調整、トリムエリアに収まるようにする
const adjustPosition = () => {
	const xLeftLimit = ((props.trimWidth - imageWidth.value * custom.value.scale) / 2) * -1
	const xRightLimit = (props.trimWidth - imageWidth.value * custom.value.scale) / 2
	const yTopLimit = ((props.trimHeight - imageHeight.value * custom.value.scale) / 2) * -1
	const yBottomLimit = (props.trimHeight - imageHeight.value * custom.value.scale) / 2

	custom.value.position.x = Math.max(Math.min(custom.value.position.x, xLeftLimit), xRightLimit)
	custom.value.position.y = Math.max(Math.min(custom.value.position.y, yTopLimit), yBottomLimit)
}
// スケール調整、トリムエリアに収まるようにする
const adjustScale = () => {
	const limit = 1
	custom.value.scale = Math.max(custom.value.scale, limit)
}
const onResize = (rect: DOMRectReadOnly) => {
	emit('resize', { width: rect.width, height: rect.height })
}

// Lifecycle Hooks -----------
onMounted(() => {
	watch(
		() => props.src,
		() => {
			imageChangeDate.value = Date.now()
		},
	)
	watch(
		() => custom.value,
		async () => {
			adjustPosition()
			adjustScale()
		},
		{ deep: true },
	)
	watch(
		() => props.src,
		async (nv, ov) => {
			if (nv !== ov) {
				// Reset image position and scale when 'src' changes
				imageWidth.value = 0
				imageHeight.value = 0
			}
		},
	)
})
</script>

<style lang="scss">
$cn: '.cropper'; // コンポーネントクラス名

#{$cn} {
	position: relative;
	z-index: 0;
	user-select: none;
	pointer-events: auto;

	&-trim {
		position: absolute;
		inset: 0;
		margin: auto;
		outline: dashed 1px var(--color-text-060);
		overflow: hidden;
		pointer-events: none;

		&-img {
			/** センタリングの施策 ↓↓↓ */
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateY(-50%) translateX(-50%);
			/** ↑↑↑ センタリングの施策 */
		}
	}

	&-outside {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 100%;
		height: 100%;
		overflow: hidden;
		opacity: 0.3;

		&-img {
			/** センタリングの施策 ↓↓↓ */
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateY(-50%) translateX(-50%);
			/** ↑↑↑ センタリングの施策 */
		}
	}

	// キャプチャーエレメントは見えないところに配置する
	&-capture {
		position: absolute;
		top: -10000vh;
		left: -10000vw;
		z-index: -10;
		overflow: hidden;

		// センタリング
		&-img {
			/** センタリングの施策 ↓↓↓ */
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateY(-50%) translateX(-50%);
			/** ↑↑↑ センタリングの施策 */
		}
	}

	&._avatar {
		#{$cn}-dotted {
			content: '';
			position: absolute;
			inset: calc(-1px * 2);
			margin: auto;
			display: block;
			// background: var(--avatar-mask-src) center / cover no-repeat;
			pointer-events: none;
		}

		#{$cn}-trim {
			mask-image: var(--avatar-mask-src);
			mask-size: 100%;
			outline: none;
		}
	}
}
</style>

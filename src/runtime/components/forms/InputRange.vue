<template>
	<Box v-resize="(r: DOMRectReadOnly) => rect = r" class="inputRange" :class="classes" :style="customColorStyle">
		<Draggable v-model="handlePosition" class="inputRange-handle" :style="handleStyle" disabled-y>
			<div class="inputRange-handle-inner" />
		</Draggable>
		<Row justify="center" align="center" nowrap>
			<template v-if="controls">
				<IconButton v-resize="(r: DOMRectReadOnly) => controlRect = r" :icon="{ name: 'minus', size: 16 }" link small
					v-bind="{ disabled }" @click="decrementValue" />
			</template>
			<Box v-resize="(rect: DOMRectReadOnly) => updateBar(rect)" class="inputRange-slider">
				<div class="inputRange-slider-bar" :style="{ transform: `scaleX(${normalizedValue})` }" />
			</Box>
			<template v-if="controls">
				<IconButton :icon="{ name: 'plus', size: 16 }" link small v-bind="{ disabled }" @click="incrementValue" />
			</template>
		</Row>
	</Box>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useForms } from '../../composables/forms'
import { useRangeInput } from '../../composables/forms/useRangeInput'
import { useCss } from '../../composables/css'
import { useNumber } from '../../composables/number'
import Box from '../layout/Box.vue'
import Row from '../layout/Row.vue'
import IconButton from '../elements/IconButton.vue'
import Draggable from '../gesture/Draggable.vue'
import type { Position } from '../gesture/Draggable.vue'

// Constants ---------------------
const HANDLE_SIZE = '16px'

// Composables ---------------------
const { config } = useForms()
const { getSize } = useCss()
const { isPureNumber } = useNumber()

// Props ---------------------
const props = defineProps({
	modelValue: { type: Number, required: true },
	min: { type: [Number, String], default: 0 },
	max: { type: [Number, String], default: 100 },
	step: { type: [Number, String], default: 1 },
	disabled: { type: Boolean, default: false },
	controls: { type: Boolean, default: false },
	handleSize: { type: [Number, String], default: '' }, // ハンドルのサイズ
	color: { type: Object, default: () => ({ handle: '', bar: '', barBackground: '' }) }, // ハンドル、バー、バー背景の色を直接指定
})

// Emits ---------------------
const emit = defineEmits(['update:modelValue'])

// Data ---------------------
const rect = ref<DOMRectReadOnly | null>(null)
const controlRect = ref<DOMRectReadOnly | null>(null)
const handlePosition = ref<Position>({ x: 0, y: 0 })
const width = ref(0)

// 共通ロジックを使用
const {
	value,
	normalizedValue,
	changePosition,
	updatePosition,
	incrementValue,
	decrementValue,
} = useRangeInput(props, emit, handlePosition, width)

// Computed -------------------------------------------
const classes = computed(() => {
	return {
		_disabled: props.disabled,
	}
})
const handleSize = computed(() => {
	// props で指定されている場合はそれを使用
	if (props.handleSize) {
		if (isPureNumber(String(props.handleSize))) {
			return getSize(Number(props.handleSize))
		}
		return String(props.handleSize)
	}
	// 設定から取得
	return config.value?.range.handleSize ?? HANDLE_SIZE
})
const handleStyle = computed(() => {
	const adjustControlWidth = `${controlRect.value?.width ?? 0}px`
	const top = `calc(50% - ${handleSize.value} / 2)`
	const left = `calc(${adjustControlWidth} - ${handleSize.value} / 2)`
	return {
		width: handleSize.value,
		height: handleSize.value,
		top,
		left,
	}
})
// color プロパティによる直接指定のスタイル
const customColorStyle = computed(() => {
	if (!props.color || (!props.color.handle && !props.color.bar && !props.color.barBackground)) {
		return {}
	}

	const style: Record<string, string> = {}

	if (props.color.handle) {
		style['--custom-range-handle-color'] = props.color.handle
	}

	if (props.color.bar) {
		style['--custom-range-bar-color'] = props.color.bar
	}

	if (props.color.barBackground) {
		style['--custom-range-bar-background-color'] = props.color.barBackground
	}

	return style
})

// Methods ---------------------
const handleChangePosition = () => {
	changePosition(false) // 水平方向
}
const updateBar = (rect: DOMRectReadOnly) => {
	width.value = rect.width
	handleUpdatePosition()
}
const handleUpdatePosition = () => {
	updatePosition(false) // 水平方向
}

// Lifecycle Hooks ---------------------
onMounted(async () => {
	await nextTick()
	// ハンドルの更新時に値を更新する
	watch(() => handlePosition.value, handleChangePosition, { deep: true })
	// v-modelの値の変化に応じてハンドル位置を更新
	watch(() => value.value, handleUpdatePosition, { immediate: true })
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.inputRange'; // コンポーネントセレクタ名

#{$cn} {
	position: relative;
	z-index: 0;

	&-slider {
		position: relative;
		height: var(--forms-range-bar-height);
		border-radius: var.$border-radius-full;
		backdrop-filter: blur(40px);
		overflow: hidden;
		background-color: var(--forms-range-bar-background-color);
		flex-grow: 1;

		&-bar {
			width: 100%;
			height: 100%;
			transform-origin: left center;
			background-color: var(--forms-range-bar-color);
		}
	}

	&-handle {
		position: absolute;
		z-index: 1;
		cursor: pointer;

		&-inner {
			width: 100%;
			height: 100%;
			border-radius: var.$border-radius-full;
			background-color: var(--forms-range-handle-color);
		}
	}

	&._disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	// カスタム色の適用
	&[style*="--custom-range-handle-color"] &-handle-inner {
		background-color: var(--custom-range-handle-color) !important;
	}

	&[style*="--custom-range-bar-background-color"] &-slider {
		background-color: var(--custom-range-bar-background-color) !important;
	}

	&[style*="--custom-range-bar-color"] &-slider-bar {
		background-color: var(--custom-range-bar-color) !important;
	}
}
</style>

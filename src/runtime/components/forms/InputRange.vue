<template>
	<Box v-resize="(r: DOMRectReadOnly) => rect = r" class="inputRange" :class="classes" :style="customColorStyle">
		<Draggable v-model="handlePosition" class="inputRange-handle" :style="handleStyle" disabled-y>
			<div class="inputRange-handle-inner" />
		</Draggable>
		<Row justify="center" align="center" nowrap>
			<template v-if="controls">
				<IconButton :icon="{ name: 'minus' }" link medium v-bind="{ disabled }" @click="value -= Number(step)" />
			</template>
			<Box v-resize="(rect: DOMRectReadOnly) => updateBar(rect)" class="inputRange-slider">
				<div class="inputRange-slider-bar" :style="{ transform: `scaleX(${normalizedValue})` }" />
			</Box>
			<template v-if="controls">
				<IconButton :icon="{ name: 'plus' }" link medium v-bind="{ disabled }" @click="value += Number(step)" />
			</template>
		</Row>
	</Box>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useForms } from '../../composables/forms'
import Box from '../layout/Box.vue'
import Row from '../layout/Row.vue'
import IconButton from '../elements/IconButton.vue'
import Draggable from '../gesture/Draggable.vue'
import type { Position } from '../gesture/Draggable.vue'

// Constants ---------------------
const HANDLE_SIZE = '16px'

// Composables ---------------------
const { config } = useForms()

// Props ---------------------
const props = defineProps({
	modelValue: { type: Number, required: true },
	min: { type: [Number, String], default: 0 },
	max: { type: [Number, String], default: 100 },
	step: { type: [Number, String], default: 1 },
	disabled: { type: Boolean, default: false },
	controls: { type: Boolean, default: false },
	color: { type: Object, default: () => ({ handle: '', bar: '', barBackground: '' }) }, // ハンドル、バー、バー背景の色を直接指定
})

// Emits ---------------------
const emit = defineEmits(['update:modelValue'])

// Data ---------------------
const rect = ref<DOMRectReadOnly | null>(null)
const handlePosition = ref<Position>({ x: 0, y: 0 })
const width = ref(0)
const height = ref(0)
const top = ref(0)
const left = ref(0)

// Computed -------------------------------------------
const classes = computed(() => {
	return {
		_disabled: props.disabled,
	}
})
const value = computed({
	get: () => {
		// 現在の modelValue を min と max の範囲内に収める
		const newValue = Math.min(Math.max(props.modelValue, Number(String(props.min))), Number(String(props.max)))
		// もし modelValue が min 未満または max より大きい場合、更新イベントを送信する
		if (props.modelValue < Number(String(props.min)) || props.modelValue > Number(String(props.max))) {
			emit('update:modelValue', newValue)
		}
		return newValue
	},
	set: (value: number) => {
		emit('update:modelValue', value)
	},
})
// 0 以上 1 以下の値に正規化
const normalizedValue = computed(() => {
	return (value.value - Number(String(props.min))) / (Number(String(props.max)) - Number(String(props.min)))
})
const handleSize = computed(() => {
	return config.value?.range.handleSize ?? HANDLE_SIZE
})
const handleStyle = computed(() => {
	const t = props.controls ? '22px' : '2px'
	const l = props.controls ? '44px' : '0px'
	const top = `calc((${height.value}px - ${handleSize.value}) / 2 + ${t})`
	const left = `calc((${height.value}px - ${handleSize.value}) / 2 + ${l})`
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
const changePosition = () => {
	const min = (handlePosition.value.x / width.value) * (Number(String(props.max)) - Number(String(props.min)))
	// 値を更新
	value.value = min + Number(String(props.min))
	// 0 以上 width 以下に制限
	handlePosition.value.x = Math.min(Math.max(handlePosition.value.x, 0), width.value)
}
const updateBar = (rect: DOMRectReadOnly) => {
	width.value = rect.width
	top.value = rect.top
	left.value = rect.left
	updatePosition()
}
const updatePosition = () => {
	// ハンドルの位置を更新
	handlePosition.value.x = normalizedValue.value * width.value
}

// Lifecycle Hooks ---------------------
onMounted(async () => {
	await nextTick()
	// ハンドルの更新時に値を更新する
	watch(() => handlePosition.value, changePosition, { deep: true })
	// v-modelの値の変化に応じてハンドル位置を更新
	watch(() => value.value, updatePosition, { immediate: true })
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

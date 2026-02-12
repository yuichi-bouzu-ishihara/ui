<!--
	Spinner
	クルクルアニメーションするアイコン
	complete prop が true になると、Spinner の円描画が消えた瞬間に CircleCheck に切り替わる
 -->
<template>
	<Box class="spinner" :class="{ _complete: complete }" v-bind="box">
		<svg v-if="!showCircleCheck" class="spinner-circular" :class="classes" viewBox="25 25 50 50">
			<circle class="spinner-circular-path" cx="50" cy="50" r="20" fill="none" :stroke-width="stroke" :style="styles"
				stroke-miterlimit="0" @animationiteration="onDashIteration" />
		</svg>
		<CircleCheck v-else v-bind="{ color, stroke }" size="120%" active @complete="onCircleCheckComplete" />
	</Box>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSpinner } from '../../composables/elements/spinner'
import { useRegex } from '../../composables/regex'
import Box from '../layout/Box.vue'
import CircleCheck from './CircleCheck.vue'

// Props の型定義
const props = defineProps({
	color: { type: String, default: '' }, // モジュールに設定されたカラー、または、#hex、rgb(r,g,b)、rgba(r,g,b,a) のカラー
	size: { type: [Number, String], default: 0 }, // 0 の場合は useSpinner().config の値を使用
	stroke: { type: [Number, String], default: 0 }, // 0 の場合は useSpinner().config の値を使用
	complete: { type: Boolean, default: false }, // true の場合、Spinner の円描画が消えた後に CircleCheck に切り替える
})

// Emits
const emit = defineEmits<{
	(e: 'complete'): void // CircleCheck のアニメーション完了時に発火
}>()

// Stores & Composables ------------------
const { isCssColor } = useRegex()

// State ------------------
const showCircleCheck = ref(false)
const pendingComplete = ref(false)

// complete prop の監視
// complete が true になったら、次の dash アニメーションの周期完了を待って CircleCheck に切り替える
watch(() => props.complete, (newVal) => {
	if (newVal) {
		pendingComplete.value = true
	}
	else {
		// complete が false に戻ったら、Spinner に戻す
		pendingComplete.value = false
		showCircleCheck.value = false
	}
}, { immediate: true })

// dash アニメーションの1サイクル完了時のハンドラ
// Spinner の円の描画がまったく無くなる瞬間（dash アニメーションの周期境界）に CircleCheck へ切り替える
const onDashIteration = () => {
	if (pendingComplete.value) {
		showCircleCheck.value = true
	}
}

// CircleCheck のアニメーション完了時のハンドラ
const onCircleCheckComplete = () => {
	emit('complete')
}

// Computed ------------------
const classes = computed(() => {
	return {
		[`_color-${color.value}`]: color.value,
	}
})

const color = computed(() => {
	let str = ''
	if (props.color === '') {
		str = useSpinner().color
	}
	else if (!isCssColor(props.color)) {
		str = props.color
	}
	else {
		return ''
	}
	return str.replace('color-', '').replace('-', '')
})

const stroke = computed(() => {
	return props.stroke === 0 ? useSpinner().stroke : props.stroke
})

const styles = computed(() => {
	let styles: { stroke?: string } = {}

	// hex、rgb、rgba のカラーが設定されている場合は、stroke を設定する
	if (!color.value && isCssColor(props.color)) {
		styles = { ...styles, stroke: props.color }
	}

	return styles
})

const box = computed(() => {
	let size: string | number = ''
	if (props.size === 0) {
		size = useSpinner().size
	}
	else {
		size = props.size
	}
	// % 指定の場合は幅のみ設定し、高さは CSS の ::before padding-top: 100% で制御する
	const isPercent = typeof size === 'string' && String(size).includes('%')
	if (isPercent) {
		return { w: size, minW: size }
	}
	return { w: size, minW: size, h: size, minH: size }
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.spinner'; // コンポーネントセレクタ名

$rotate-duration: 1.6s;
$dash-duration: 1.16s;

#{$cn} {
	position: relative;

	&:not(._complete):before {
		content: '';
		display: block;
		padding-top: 100%;
	}

	&-circular {
		animation: rotate $rotate-duration linear infinite;
		height: 100%;
		transform-origin: center center;
		width: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;

		&-path {
			stroke-dasharray: 1, 200;
			stroke-dashoffset: 0;
			animation: dash $dash-duration ease-in-out infinite;
			stroke-linecap: square;
			stroke: var(--color-dark);
		}

		// Color
		@each $priority in var.$color-priorities {
			@each $tint in var.$color-tint {
				&._color-#{$priority}#{$tint} {
					@include mix.color-var($priority, $tint) using ($css-var) {
						#{$cn}-circular-path {
							stroke: $css-var;
						}
					}
				}
			}
		}
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 1, 200;
			stroke-dashoffset: 0;
		}

		50% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -35px;
		}

		100% {
			stroke-dasharray: 89, 200;
			stroke-dashoffset: -124px;
		}
	}
}
</style>

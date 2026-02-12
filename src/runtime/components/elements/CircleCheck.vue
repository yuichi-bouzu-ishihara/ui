<!--
	CircleCheck
	上から時計回りに円を描くアニメーションをし、円が完成したら中心に check アイコンを表示するコンポーネント
 -->
<template>
	<Box class="circleCheck" v-bind="box">
		<svg class="circleCheck-circular" :class="classes" viewBox="0 0 50 50">
			<!-- 背景の薄い円 -->
			<!-- <circle class="circleCheck-circular-bg" cx="25" cy="25" r="20" fill="none" :stroke-width="strokeValue"
				:style="strokeStyles" /> -->
			<!-- アニメーションする円 -->
			<circle class="circleCheck-circular-path" cx="25" cy="25" r="20" fill="none" :stroke-width="strokeValue"
				:style="circleStyles" stroke-linecap="square" @animationend="onCircleAnimationEnd" />
		</svg>
		<!-- チェックアイコン -->
		<Transition name="circleCheck-icon">
			<svg v-if="showCheck" class="circleCheck-check" :class="classes" viewBox="0 0 50 50">
				<polyline class="circleCheck-check-path" fill="none" :stroke-width="checkStrokeValue" stroke-linecap="square"
					stroke-linejoin="round" points="12,27 21,35 38,16" :style="checkStyles" />
			</svg>
		</Transition>
	</Box>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCircleCheck } from '../../composables/elements/circle-check'
import { useRegex } from '../../composables/regex'
import Box from '../layout/Box.vue'

// Props の型定義
const props = defineProps({
	color: { type: String, default: '' }, // モジュールに設定されたカラー、または、#hex、rgb(r,g,b)、rgba(r,g,b,a) のカラー
	size: { type: [Number, String], default: 0 }, // 0 の場合は useCircleCheck().config の値を使用
	stroke: { type: [Number, String], default: 0 }, // 0 の場合は useCircleCheck().config の値を使用
	duration: { type: [Number, String], default: 0 }, // 0 の場合は useCircleCheck().config の値を使用（ms）
	active: { type: Boolean, default: true }, // アニメーションを開始するかどうか
})

// Emits
const emit = defineEmits<{
	(e: 'complete'): void // アニメーション完了時に発火
}>()

// Stores & Composables ------------------
const { isCssColor } = useRegex()

// State ------------------
const showCheck = ref(false)
const isAnimating = ref(false)

// active prop の監視でアニメーションをリセット・開始
watch(() => props.active, (newVal) => {
	if (newVal) {
		showCheck.value = false
		isAnimating.value = true
	}
	else {
		showCheck.value = false
		isAnimating.value = false
	}
}, { immediate: true })

// 円アニメーション完了時のハンドラ
const onCircleAnimationEnd = () => {
	showCheck.value = true
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
		str = useCircleCheck().color as string
	}
	else if (!isCssColor(props.color)) {
		str = props.color
	}
	else {
		return ''
	}
	return str.replace('color-', '').replace('-', '')
})

const strokeValue = computed(() => {
	return props.stroke === 0 ? useCircleCheck().stroke : props.stroke
})

const checkStrokeValue = computed(() => {
	return props.stroke === 0 ? useCircleCheck().stroke * 2 : Number(props.stroke) * 2
})

const durationValue = computed(() => {
	return props.duration === 0 ? useCircleCheck().duration : Number(props.duration)
})

const circleStyles = computed(() => {
	const circumference = 2 * Math.PI * 20 // r=20 の円周 ≈ 125.66

	let styles: Record<string, string> = {
		'--circle-circumference': `${circumference}`,
		'--circle-duration': `${durationValue.value}ms`,
	}

	// hex、rgb、rgba のカラーが設定されている場合は、stroke を設定する
	if (!color.value && isCssColor(props.color)) {
		styles = { ...styles, stroke: props.color }
	}

	// アニメーション中でない場合はアニメーションを止める
	if (!isAnimating.value) {
		styles = { ...styles, animation: 'none' }
	}

	return styles
})

const checkStyles = computed(() => {
	let styles: Record<string, string> = {}

	// hex、rgb、rgba のカラーが設定されている場合は、stroke を設定する
	if (!color.value && isCssColor(props.color)) {
		styles = { ...styles, stroke: props.color }
	}

	return styles
})

const box = computed(() => {
	let size: string | number = ''
	if (props.size === 0) {
		size = useCircleCheck().size as number
	}
	else {
		size = props.size
	}
	return { w: size, minW: size, h: size, minH: size }
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.circleCheck'; // コンポーネントセレクタ名

#{$cn} {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	&-circular {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		// 上（12時の位置）から開始するために -90deg 回転
		transform: rotate(-90deg);

		&-bg {
			stroke: var(--color-dark);
			opacity: 0.1;
		}

		&-path {
			stroke: var(--color-dark);
			stroke-dasharray: var(--circle-circumference);
			stroke-dashoffset: var(--circle-circumference);
			animation: circleCheck-draw var(--circle-duration, 800ms) ease forwards;
		}

		// Color
		@each $priority in var.$color-priorities {
			@each $tint in var.$color-tint {
				&._color-#{$priority}#{$tint} {
					@include mix.color-var($priority, $tint) using ($css-var) {
						#{$cn}-circular-bg {
							stroke: $css-var;
						}

						#{$cn}-circular-path {
							stroke: $css-var;
						}
					}
				}
			}
		}
	}

	&-check {
		width: 49%;
		height: 49%;
		position: relative;
		z-index: 1;

		&-path {
			stroke: var(--color-dark);
			stroke-dasharray: 50;
			stroke-dashoffset: 50;
			animation: circleCheck-checkDraw 0.35s ease forwards;
		}

		// Color
		@each $priority in var.$color-priorities {
			@each $tint in var.$color-tint {
				&._color-#{$priority}#{$tint} {
					@include mix.color-var($priority, $tint) using ($css-var) {
						#{$cn}-check-path {
							stroke: $css-var;
						}
					}
				}
			}
		}
	}

	// チェックアイコンの表示トランジション
	&-icon-enter-active {
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	&-icon-enter-from {
		opacity: 0;
	}

	&-icon-enter-to {
		opacity: 1;
	}

	// 円描画アニメーション（上から時計回り）
	@keyframes circleCheck-draw {
		0% {
			stroke-dashoffset: var(--circle-circumference);
		}

		100% {
			stroke-dashoffset: 0;
		}
	}

	// チェックマーク描画アニメーション
	@keyframes circleCheck-checkDraw {
		0% {
			stroke-dashoffset: 50;
		}

		100% {
			stroke-dashoffset: 0;
		}
	}
}
</style>

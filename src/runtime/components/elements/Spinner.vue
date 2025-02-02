<!--
	Spinner
	クルクルアニメーションするアイコン
 -->
<template>
	<Box class="spinner" v-bind="box">
		<svg class="spinner-circular" :class="classes" viewBox="25 25 50 50">
			<circle class="spinner-circular-path" cx="50" cy="50" r="20" fill="none" :stroke-width="stroke"
				stroke-miterlimit="0" />
		</svg>
	</Box>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSpinner } from '../../composables/elements/spinner'
import Box from '../layout/Box.vue'

// Props の型定義
const props = defineProps({
	color: { type: String, default: '' },
	size: { type: [Number, String], default: 0 }, // 0 の場合は useSpinner().config の値を使用
	stroke: { type: [Number, String], default: 0 }, // 0 の場合は useSpinner().config の値を使用
})

const classes = computed(() => {
	return {
		[`_color-${color.value}`]: color.value,
	}
})

const color = computed(() => {
	let str = ''
	if (props.color) {
		str = props.color
	}
	else {
		str = useSpinner().color
	}
	return str.replace('color-', '').replace('-', '')
})

const stroke = computed(() => {
	return props.stroke === 0 ? useSpinner().stroke : props.stroke
})

const box = computed(() => {
	let size: string | number = ''
	if (props.size === 0) {
		size = useSpinner().size
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
$cn: '.spinner'; // コンポーネントセレクタ名

$rotate-duration: 1.6s;
$dash-duration: 1.16s;

@mixin color($color: var(--color-dark)) {
	stroke: $color;
}

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;

		&:before {
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

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

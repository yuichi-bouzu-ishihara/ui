<template>
	<component :is="tag" class="logo" :class="classes" :style="styles">
		{{ useLogo().alt }}
	</component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCss } from '../../composables/css'
import { useNumber } from '../../composables/number'
import { useLogo } from '../../composables/elements/logo'

// Stores & Composables ---------------------------
const { getSize } = useCss() // css に関する関数
const { isPureNumber } = useNumber()

// Props の型定義
const props = defineProps({
	tag: { type: String, default: 'div' },
	color: { type: String, default: '' },
	size: { type: [Number, String], default: 11 },
})

// Computed ------------------
const classes = computed(() => {
	return {
		[`_color-${color.value}`]: color.value,
	}
})
const styles = computed(() => {
	let fontSize = ''
	if (isPureNumber(String(props.size))) {
		fontSize = getSize(Number(props.size))
	}
	else {
		fontSize = String(props.size)
	}
	return { fontSize }
})
const color = computed(() => {
	let str = ''
	if (props.color) {
		str = props.color
	}
	return str.replace('color-', '').replace('-', '')
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.logo'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		display: block;
		color: transparent;
		margin: 0;
		transition-property: background-color;
		transition-duration: 0.25s;
		transition-timing-function: ease;
		user-select: none; // テキスト選択不可

		font-size: 1.0em;
		line-height: 1;
		width: calc(var(--logo-width) / var(--logo-height) * 1em);
		height: 1em;
		overflow: hidden;

		&:not([class*="_color"]) {
			background-image: var(--logo-src);
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
		}

		&[class*="_color"] {
			mask-image: var(--logo-src);
			mask-repeat: no-repeat;
			mask-size: contain;
			mask-position: center;
		}

		// Color
		@each $priority in var.$color-priorities {
			@each $tint in var.$color-tint {
				&._color-#{$priority}#{$tint} {
					@include mix.color-var($priority, $tint) using ($css-var) {
						background-color: $css-var;
					}
				}
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

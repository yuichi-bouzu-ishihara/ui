<template>
	<component :is="tag" class="logo" :class="classes" :style="styles">
		{{ name }}
	</component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCss } from '../../composables/css'
import { useNumber } from '../../composables/number'

// Stores & Composables ---------------------------
const { getSize } = useCss() // css に関する関数
const { isPureNumber } = useNumber()

// Props の型定義
const props = defineProps({
	tag: { type: String, default: 'div' },
	color: { type: [String, Number], default: 'text' },
	size: { type: [Number, String], default: 11 },
	technologies: { type: Boolean, default: false },
})

// Computed ------------------
const classes = computed(() => {
	return {
		_technologies: props.technologies,
		[`_${props.color}`]: props.color,
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
const name = computed(() => {
	let str = 'HONOO'
	if (props.technologies) {
		str = 'HONOO Technologies'
	}
	return str
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
		mask-image: url(../../assets/bouzu-ui/imgs/logo.svg);
		mask-repeat: no-repeat;
		mask-size: contain;
		mask-position: center;
		margin: 0;
		transition-property: background-color;
		transition-duration: 0.25s;
		transition-timing-function: ease;
		user-select: none; // テキスト選択不可

		font-size: 1.0em;
		line-height: 1;
		height: 1em;
		overflow: hidden;

		&._technologies {
			// mask-image: url(~/assets/img/logo-beta.svg);
		}

		// Color
		@each $priority in var.$color-priorities {
			@each $tint in var.$color-tint {
				&._#{$priority}#{$tint} {
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

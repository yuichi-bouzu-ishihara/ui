<template>
	<div class="notice" :class="classes">
		<template v-if="border">
			<div class="notice-border"
				:style="{ borderWidth: `${getSize(Number(border))}`, inset: `-${getSize(Number(border))}` }" />
		</template>
		<div class="notice-number">
			<Typography caption2 bold center baseline-height color="light">
				{{ count }}
			</Typography>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCss } from '../../composables/css'
import Typography from './Typography.vue'

// Composables --------------------------------
const { getSize } = useCss()

// Props --------------------------------
const props = defineProps({
	count: { type: [Number, String], default: 0 },
	border: { type: [Number, String], default: 0 },
	borderColor: { type: String, default: 'darkblack' },
})

// Computed ---------------------------------
const classes = computed(() => {
	return {
		[`_${props.borderColor}`]: true,
	}
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.notice'; // コンポーネントセレクタ名

$min-width: 16;
$height: 16;
$padding-left: 4;
$padding-right: 4;
$padding-bottom: .2;

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		z-index: 0;

		&-number {
			position: relative;
			z-index: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: func.get-size($min-width);
			height: func.get-size($height);
			background-color: var(--color-primary);
			border-radius: var.$border-radius-full;
			padding-left: func.get-size($padding-left);
			padding-right: func.get-size($padding-right);
			padding-bottom: func.get-size($padding-bottom);
		}

		&-border {
			position: absolute;
			border-radius: var.$border-radius-full;
			border-style: solid;
			border-color: transparent;
		}

		// Color
		@each $priority in var.$color-priorities {
			@each $tint in var.$color-tint {
				&._#{$priority}#{$tint} {
					@include mix.color-var($priority, $tint) using ($css-var) {
						#{$cn}-border {
							border-color: $css-var;
						}
					}
				}
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {
		&-number {
			min-width: func.get-size($min-width, false);
			height: func.get-size($height, false);
			padding-left: func.get-size($padding-left, false);
			padding-right: func.get-size($padding-right, false);
			padding-bottom: func.get-size($padding-bottom, false);
		}
	}
}
</style>

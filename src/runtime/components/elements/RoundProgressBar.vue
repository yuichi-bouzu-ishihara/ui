<template>
	<div class="roundProgressBar" :class="classes">
		<svg :width="size" :height="size" viewBox="0 0 36 36" class="roundProgressBar-chart">
			<path class="roundProgressBar-chart-bg" :style="styles" d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831" />
			<path class="roundProgressBar-chart-stroke" :style="styles" :stroke-dasharray="`${percent}, 100`" d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831" />
			<!-- <text x="18" y="20.35" class="roundProgressBar-percentage">{{ progress }}%</text> -->
		</svg>
	</div>
</template>

<script setup lang="ts">
import { useRoundProgressBar } from '../../composables/elements/round-progress-bar'
import { computed } from '#imports'

// Props ------------------
const props = defineProps({
	percent: { type: Number, default: 0 }, // 進捗率 (0-100)
	size: { type: [String, Number], default: 100 }, // SVGのサイズ
	stroke: { type: [String, Number], default: 2.8 }, // ボーダーの太さ。 ※4以上にするとボーダーが見切れる
	color: { type: String, default: '' }, // ボーダーの色
})

// Computed ------------------

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
		str = useRoundProgressBar().color
	}
	return str.replace('color-', '').replace('-', '')
})
const styles = computed(() => {
	return {
		'stroke-width': props.stroke,
	}
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.roundProgressBar'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		&-chart {
			display: block;

			&-bg {
				fill: none;
			}

			&-stroke {
				fill: none;
				// stroke-linecap: round;
				transition: stroke-dasharray 0.3s ease;
			}
		}

		&-percentage {
			fill: #666;
			font-family: sans-serif;
			font-size: 0.5em;
			text-anchor: middle;
		}

		// Color
		@each $priority in var.$color-priorities {
			@each $tint in var.$color-tint {
				&._color-#{$priority}#{$tint} {
					@include mix.color-var($priority, $tint) using ($css-var) {
						#{$cn}-chart-bg {
							stroke: $css-var;
							opacity: 0.1;
						}

						#{$cn}-chart-stroke {
							stroke: $css-var;
						}
					}
				}
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

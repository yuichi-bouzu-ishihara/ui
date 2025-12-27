<template>
	<Box class="tooltip" :class="classes" :style="variables" inline-block>
		<div class="tooltip-inner">
			<Typography v-if="!disabled" v-resize="(rect: DOMRectReadOnly) => { width = rect.width; height = rect.height }"
				caption3 center nowrap cap-height-baseline color="var(--tool-tip-text-color)">
				<template v-if="text">
					<!-- eslint-disable-next-line vue/no-v-html -->
					<span v-html="text" />
				</template>
			</Typography>
		</div>
		<slot />
	</Box>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Typography from '../elements/Typography.vue'
import Box from '../layout/Box.vue'

const props = defineProps({
	text: { type: String, default: '' }, // 表示するテキスト
	disabled: { type: Boolean, default: false }, // 無効にするかどうか
	defaultOpen: { type: Boolean, default: false }, // 強制的に表示するかどうか

	// 表示する時に、ラップしている要素からどのくらい距離を開けるか。px でも % でも可。
	distance: { type: String, default: '8px' },

	// 表示を開始する場所 = ラップしている要素の中心 からどのくらい距離を開けて開始点とするか。px でも % でも可。
	// 基本は UPなら上端、DOWNなら下端にするために、50%を指定する。
	// ※CSSのデフォルトで指定しているのが 50%で、それが中心点となっているため。
	start: { type: String, default: '50%' },

	// 表示する方向： ↑up →right ↓down ←left
	placement: {
		type: String,
		default: 'up',
		validator(val: string) {
			return ['up', 'right', 'down', 'left'].includes(val)
		},
	},
})

// Data ------------------------------------------------------------
const width = ref(0)
const height = ref(0)

// Computed ---------------------------
const classes = computed(() => {
	return {
		_disabled: props.disabled,
		_defaultOpen: props.defaultOpen,
		[`_${props.placement}`]: true,
	}
})
const variables = computed(() => {
	return {
		'--start': props.start,
		'--distance': props.distance,
		'--width': `${width.value}px`,
		'--height': `${height.value}px`,
	}
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;

$padding-top: 5.6px;
$padding-right: 8px;
$padding-bottom: 6.4px;
$padding-left: 8px;
$start: var(--start);
$distance: var(--distance);
$width: calc(var(--width) + $padding-left + $padding-right);
$height: calc(var(--height) + $padding-top + $padding-bottom);

.tooltip {
	position: relative;
	z-index: 0;

	&-inner {
		position: absolute;
		// inset: 0;
		z-index: 1;
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		width: $width;
		height: $height;
		border-radius: 4px;
		// box-shadow: 0 0 1px global.$light-50;
		background-color: var(--tool-tip-background-color);
		backdrop-filter: blur(40px);
		box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.3);
		transition: var.$transition-base;
		transition-duration: var.$transition-fast-duration;
		opacity: 0;
		user-select: none;
		pointer-events: none;
	}

	&-slot {
		z-index: 0;
		width: 100%;
	}

	// 無効でなければ表示する
	&:not(._disabled):hover &-inner,
	&._defaultOpen &-inner {
		opacity: 1;
	}

	// 上方向に表示する
	&:not(._disabled)._up &-inner {
		left: calc(#{$width} / 2 * -1 + 50%);
		bottom: calc(50% + #{$start}); // デフォルトは、tipsでラップしている要素の上端
		transform: translateY(0px);
	}

	&:not(._disabled)._up:hover &-inner,
	&._defaultOpen._up &-inner {
		transform: translateY(calc(#{$distance} * -1));
	}

	// 下方向に表示する
	&:not(._disabled)._down &-inner {
		top: calc(50% + #{$start}); // デフォルトは、tipsでラップしている要素の下端
		left: calc(#{$width} / 2 * -1 + 50%);
		transform: translateY(0px);
	}

	&:not(._disabled)._down:hover &-inner,
	&._defaultOpen._down &-inner {
		transform: translateY($distance);
	}

	// 右方向に表示する
	&:not(._disabled)._right &-inner {
		left: calc(50% + #{$start}); // デフォルトは、tipsでラップしている要素の右端
		top: calc(#{$height} / 2 * -1 + 50%);
	}

	&:not(._disabled)._right:hover &-inner,
	&._defaultOpen._right &-inner {
		transform: translateX($distance);
	}

	// 左方向に表示する
	&:not(._disabled)._left &-inner {
		right: calc(50% + #{$start}); // tipsでラップしている要素の左端
		top: calc(#{$height} / 2 * -1 + 50%);
	}

	&:not(._disabled)._left:hover &-inner,
	&._defaultOpen._left &-inner {
		transform: translateX(calc(#{$distance} * -1));
	}
}
</style>

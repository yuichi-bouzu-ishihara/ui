<template>
	<Box class="skeletonShape" :class="classes" :style="styles" :r="shape === 'circle' ? 'circle' : 0" max-w="100%"
		:bg-blur="blur" v-bind="box" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Box from '../layout/Box.vue'
import { useSkeletonShape } from '../../composables/elements/skeleton-shape'

// Composables ------------------
const { blur } = useSkeletonShape()

// Props ------------------
const props = defineProps({
	rect: { type: Boolean, default: false }, // 矩形かどうか
	circle: { type: Boolean, default: false }, // 円形かどうか
	avatar: { type: Boolean, default: false }, // アバターかどうか
	w: { type: [Number, String], default: 0 }, // 横幅 px
	h: { type: [Number, String], default: 0 }, // 高さ px
	delayIndex: { type: [Number, String], default: -1 }, // アニメーション遅延のインデックス。 delay は theme config で設定した値を使用する。
	delay: { type: [Number, String], default: 0 }, // アニメーション遅延 ms。 delayIndex が -1 の場合はこの値を使用する。
	animation: { type: Boolean, default: true }, // アニメーションを有効にするか
})

// Computed ------------------
const classes = computed(() => {
	return {
		_animation: props.animation,
		[`_${shape.value}`]: true,
	}
})
const styles = computed(() => {
	if (props.delayIndex === -1) {
		return {
			'animation-delay': `${props.delay}ms`,
		}
	}
	else {
		return {
			'animation-delay': `calc(var(--skeleton-shape-delay) * ${props.delayIndex})`,
		}
	}
})
const box = computed(() => {
	if (props.circle || props.avatar) {
		return {
			w: props.w,
			h: props.w,
			minW: props.w,
			minH: props.w,
		}
	}
	else {
		return {
			w: props.w,
			h: props.h,
		}
	}
})
const shape = computed(() => {
	return props.rect ? 'rect' : props.circle ? 'circle' : props.avatar ? 'avatar' : 'rect'
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;

$cn: '.skeletonShape'; // クラス名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		background-color: var(--skeleton-shape-color);

		&._avatar {
			mask-image: url(../../assets/bouzu-ui/avatar/mask.svg);
			mask-size: 100%;
		}

		&._animation {
			animation: skeletonShape-animation var(--skeleton-shape-duration) infinite;

			@keyframes skeletonShape-animation {
				0% {
					background-color: var(--skeleton-shape-color);
				}

				50% {
					background-color: var(--skeleton-shape-animation-to);
				}

				100% {
					background-color: var(--skeleton-shape-color);
				}
			}
		}
	}
}
</style>

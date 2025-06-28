<template>
	<Box class="skeletonShape" :class="classes" :r="shape === 'circle' ? 'circle' : 0" max-w="100%" :bg-blur="blur"
		v-bind="box" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import Box from '../layout/Box.vue'
import { useSkeletonShape } from '../../composables/elements/skeleton-shape'
import { useUtils } from '../../composables/utils'

// Props ------------------
const props = defineProps({
	rect: { type: Boolean, default: false }, // 矩形かどうか
	circle: { type: Boolean, default: false }, // 円形かどうか
	avatar: { type: Boolean, default: false }, // アバターかどうか
	w: { type: [Number, String], default: 0 }, // 横幅 px
	h: { type: [Number, String], default: 0 }, // 高さ px
	r: { type: [Number, String], default: 0 }, // 角丸 px
	delayIndex: { type: [Number, String], default: -1 }, // アニメーション遅延のインデックス。 delay は theme config で設定した値を使用する。
	delay: { type: [Number, String], default: 0 }, // アニメーション遅延 ms。 delayIndex が -1 の場合はこの値を使用する。
	animation: { type: Boolean, default: true }, // アニメーションを有効にするか
	blur: { type: Boolean, default: false }, // ブラーを有効にするか
})

// Data ------------------
const isAnimating = ref(false)

// Computed ------------------
const classes = computed(() => {
	return {
		[`_${shape.value}`]: true,
		_to: props.animation && isAnimating.value,
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
			r: props.r,
		}
	}
})
const shape = computed(() => {
	return props.rect ? 'rect' : props.circle ? 'circle' : props.avatar ? 'avatar' : 'rect'
})

const duration = computed(() => {
	return Number.parseFloat(useSkeletonShape().config.value?.duration ?? '0') / 2
})

const startDelay = computed(() => {
	const index = props.delayIndex === -1 ? 0 : props.delayIndex
	return Number.parseFloat(useSkeletonShape().config.value?.delay ?? '0') * Number.parseInt(String(index))
})

// Methods ------------------
const animationLoop = async () => {
	if (!props.animation) return
	await useUtils().wait(duration.value)
	isAnimating.value = !isAnimating.value
	animationLoop()
}

// Lifecycle ------------------
onMounted(async () => {
	if (!props.animation) return
	await useUtils().wait(startDelay.value)
	animationLoop()
})
onUnmounted(() => {
	isAnimating.value = false
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;

$cn: '.skeletonShape'; // クラス名

#{$cn} {
	background-color: var(--skeleton-shape-color);
	transition: background-color calc(var(--skeleton-shape-duration) / 2) linear;

	&._avatar {
		mask-image: url(../../assets/bouzu-ui/avatar/mask.svg);
		mask-size: 100%;
	}

	&._to {
		background-color: var(--skeleton-shape-animation-to);
	}
}
</style>

<template>
	<div class="marquee" :class="classes" :style="styles">
		<div v-for="i in repeat" :key="`marquee-content-${i}`" class="marquee-content">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props ------------------
const props = defineProps({
	/** アニメーションの速度（秒） */
	duration: { type: [Number, String], default: 20 },
	/** 子要素間の gap（px） */
	gap: { type: [Number, String], default: 16 },
	/** コンテンツの繰り返し回数（横幅を埋めるための複製数） */
	repeat: { type: Number, default: 4 },
	/** アニメーション方向を反転する */
	reverse: { type: Boolean, default: false },
	/** ホバー時にアニメーションを一時停止する */
	pauseOnHover: { type: Boolean, default: false },
	/** 左右にグラデーションマスクを表示する */
	gradationMask: { type: Boolean, default: false },
})

// Computed --------------------------------------------------------
const classes = computed(() => ({
	_reverse: props.reverse,
	_pauseOnHover: props.pauseOnHover,
	_gradationMask: props.gradationMask,
}))

const styles = computed(() => ({
	'--marquee-duration': typeof props.duration === 'number' ? `${props.duration}s` : props.duration,
	'--marquee-gap': typeof props.gap === 'number' ? `${props.gap}px` : props.gap,
}))
</script>

<style lang="scss">
@use '../../scss/_mixins.scss' as mix;
$cn: '.marquee';

@keyframes marquee-scroll {
	from {
		transform: translate3d(0, 0, 0);
	}
	to {
		transform: translate3d(calc(-100% - var(--marquee-gap)), 0, 0);
	}
}

@include mix.component-styles($cn) using ($mode) {
	@if $mode == 'base' {
		position: relative;
		display: flex;
		align-items: center;
		overflow: hidden;
		gap: var(--marquee-gap);

		&-content {
			display: flex;
			align-items: center;
			flex-shrink: 0;
			gap: var(--marquee-gap);
			min-width: max-content;
			animation: marquee-scroll var(--marquee-duration) linear infinite;
			backface-visibility: hidden;
		}

		// 反転
		&._reverse &-content {
			animation-direction: reverse;
		}

		// ホバー時一時停止
		&._pauseOnHover:hover &-content {
			animation-play-state: paused;
		}

		// グラデーションマスク（左右）
		&._gradationMask {
			&::before,
			&::after {
				content: '';
				position: absolute;
				top: 0;
				bottom: 0;
				width: 15%;
				z-index: 1;
				pointer-events: none;
			}

			&::before {
				left: 0;
				background: linear-gradient(to right, var(--color-background, #fff), transparent);
			}

			&::after {
				right: 0;
				background: linear-gradient(to left, var(--color-background, #fff), transparent);
			}
		}
	}

	@if $mode == 'darkmode' {}

	@if $mode == 'auto' {}
}
</style>

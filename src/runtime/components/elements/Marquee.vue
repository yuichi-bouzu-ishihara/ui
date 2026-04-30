<template>
	<div class="marquee" :class="classes" :style="styles">
		<div v-for="i in cloneCount" :key="`marquee-content-${i}`" class="marquee-content">
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
	/** コンテンツの複製数（横幅を埋めるため） */
	cloneCount: { type: Number, default: 4 },
	/** アニメーション方向を反転する */
	reverse: { type: Boolean, default: false },
	/** アニメーションを停止する */
	paused: { type: Boolean, default: false },
	/** ホバー時にアニメーションを一時停止する */
	pauseOnHover: { type: Boolean, default: false },
	/** 左右にグラデーションマスクを表示する */
	gradationMask: { type: Boolean, default: false },
})

// Computed --------------------------------------------------------
const classes = computed(() => ({
	_paused: props.paused,
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
@use '../../scss/_variables.scss' as var;
$cn: '.marquee';

@keyframes marquee-scroll {
	from {
		transform: translate3d(0, 0, 0);
	}
	to {
		transform: translate3d(calc(-100% - var(--marquee-gap)), 0, 0);
	}
}

#{$cn} {
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

	// 停止
	&._paused &-content {
		animation-play-state: paused;
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
</style>

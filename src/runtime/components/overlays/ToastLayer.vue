<template>
	<Container narrow class="toastLayer">
		<TransitionGroup name="toast" tag="div" class="toastLayer-list" @before-leave="onBeforeLeave">
			<Toast
				v-for="toast in list"
				:key="toast.id"
				class="toastLayer-item"
				v-bind="toast"
				@close="hide(toast.id)"
			/>
		</TransitionGroup>
	</Container>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/overlays/toast'
import Toast from './Toast.vue'

const { list, hide } = useToast()

/**
 * 非表示アニメーション開始前に要素の位置とサイズを固定する。
 * position: absolute に切り替わった際にジャンプしないようにする。
 */
const onBeforeLeave = (el: Element) => {
	const htmlEl = el as HTMLElement
	const { offsetTop, offsetLeft, offsetWidth } = htmlEl
	htmlEl.style.top = `${offsetTop}px`
	htmlEl.style.left = `${offsetLeft}px`
	htmlEl.style.width = `${offsetWidth}px`
}
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
$cn: '.toastLayer';

#{$cn} {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding-bottom: calc(var(--toast-bottom, 16px) + env(safe-area-inset-bottom));
	display: flex;
	flex-direction: column;
	align-items: center;
	pointer-events: none;

	&:empty {
		display: none;
	}

	&-list {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&-item {
		width: 100%;
		max-width: 100%;
	}
}

// 表示アニメーション
.toast-enter-active {
	transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

// 非表示アニメーション
.toast-leave-active {
	transition: all 0.25s var.$transition-base-timing-function;
	position: absolute;
}

// 移動アニメーション（他のToastが追加/削除された時）
.toast-move {
	transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

// 表示開始状態
.toast-enter-from {
	opacity: 0;
	transform: translateY(100%);
}

// 非表示終了状態
.toast-leave-to {
	opacity: 0;
	transform: translateY(20px);
}
</style>

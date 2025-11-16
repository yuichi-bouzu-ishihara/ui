<template>
	<ClientOnly>
		<div :style="variables">
			<TransitionGroup name="transitionGropuVerticalList" appear>
				<slot />
			</TransitionGroup>
		</div>
	</ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props --------------
const props = defineProps({
	enterFrom: { type: String, default: 'translateX(40px)' },
	leaveTo: { type: String, default: 'translateX(-80px)' },
})

// Computed --------------
const variables = computed(() => {
	return {
		'--transitionGropuVerticalList-enter-from': props.enterFrom,
		'--transitionGropuVerticalList-leave-to': props.leaveTo,
	}
})
</script>

<style lang="scss">
// コンテンツトランジションのスタイル
.transitionGropuVerticalList-move,
.transitionGropuVerticalList-enter-active,
.transitionGropuVerticalList-leave-active {
	transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.transitionGropuVerticalList-enter-from {
	opacity: 0;
	transform: var(--transitionGropuVerticalList-enter-from);
}

.transitionGropuVerticalList-leave-to {
	opacity: 0;
	transform: var(--transitionGropuVerticalList-leave-to);
}

.transitionGropuVerticalList-leave-active {
	position: absolute;
	width: 100%;
	z-index: 1;
}

.transitionGropuVerticalList-enter-active {
	z-index: 2;
}

// 移動中の要素のスタイル
.transitionGropuVerticalList-move {
	transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>

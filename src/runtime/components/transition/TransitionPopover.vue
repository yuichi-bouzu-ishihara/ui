<template>
	<ClientOnly>
		<Transition name="transitionPopover" appear :style="variables" @before-enter="beforeEnter" @after-enter="afterEnter"
			@before-leave="beforeLeave" @after-leave="afterLeave">
			<slot />
		</Transition>
	</ClientOnly>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'

// Props --------------
const props = defineProps({
	x: { type: [String, Number], default: 0 }, // 0 までの移動距離。 + で 右 → 左、 - で 右 → 左。
	y: { type: [String, Number], default: 0 }, // 0 までの移動距離。 + で 右 → 左、 - で 右 → 左。
	duration: { type: [String, Number], default: 150 },
	delay: { type: [String, Number], default: 0 },
})

// Data --------------
const { x, y, duration, delay } = toRefs(props)

// Computed --------------
const variables = computed(() => {
	const translateX = x.value
	let translateY = y.value

	if (!translateX && !translateY) {
		translateY = 20
	}

	return {
		'--transitionPopover-x': `${translateX}px`,
		'--transitionPopover-y': `${translateY}px`,
		'--transitionPopover-duration': `${duration.value}ms`,
		'--transitionPopover-delay': `${delay.value}ms`,
	}
})

// Methods --------------
const EMIT_SHOW_START = 'show-start'
const EMIT_SHOW_END = 'show-end'
const EMIT_HIDE_START = 'hide-start'
const EMIT_HIDE_END = 'hide-end'

const emit = defineEmits([EMIT_SHOW_START, EMIT_SHOW_END, EMIT_HIDE_START, EMIT_HIDE_END])
const beforeEnter = () => {
	emit(EMIT_SHOW_START)
}
const afterEnter = () => {
	emit(EMIT_SHOW_END)
}
const beforeLeave = () => {
	emit(EMIT_HIDE_START)
}
const afterLeave = () => {
	emit(EMIT_HIDE_END)
}
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;

.transitionPopover-enter-active,
.transitionPopover-leave-active {
	transition-property: transform, opacity;
	transition-duration: var(--transitionPopover-duration);
	transition-delay: var(--transitionPopover-delay);
	transition-timing-function: var.$transition-base-timing-function;
	transition: var.$transition-base;
}

.transitionPopover-enter-from {
	opacity: 0;
	transform: translateX(var(--transitionPopover-x)) translateY(var(--transitionPopover-y));
}

.transitionPopover-enter-to {
	opacity: 1;
	transform: translateY(0);
}

.transitionPopover-leave-from {
	opacity: 1;
	transform: translateY(0);
}

.transitionPopover-leave-to {
	opacity: 0;
	transform: translateX(var(--transitionPopover-x)) translateY(var(--transitionPopover-y));
}
</style>

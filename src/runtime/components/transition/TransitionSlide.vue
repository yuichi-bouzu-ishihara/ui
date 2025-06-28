<template>
	<ClientOnly>
		<Transition :name="`transitionSlide-${direction}`" appear :style="variables" @before-enter="beforeEnter"
			@after-enter="afterEnter" @before-leave="beforeLeave" @after-leave="afterLeave">
			<slot />
		</Transition>
	</ClientOnly>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'

// Props --------------
const props = defineProps({
	from: { type: String, default: 'left', validator: (v: string) => ['left', 'right', 'top', 'bottom'].includes(v) }, // スライドインしてくる方向
	duration: { type: [String, Number], default: 150 },
	delay: { type: [String, Number], default: 0 },
})

// Data --------------
const { from, duration, delay } = toRefs(props)

// Computed --------------
const direction = computed(() => {
	return from.value === 'left' || from.value === 'right' ? 'x' : 'y'
})
const variables = computed(() => {
	let fromPosition: string = ''
	switch (from.value) {
		case 'right':
		case 'bottom':
			fromPosition = '100%'
			break
		case 'left':
		case 'top':
		default:
			fromPosition = '-100%'
	}
	return {
		[`--transitionSlide-${direction.value}`]: fromPosition,
		'--transitionSlide-duration': `${duration.value}ms`,
		'--transitionSlide-delay': `${delay.value}ms`,
	}
})

// Methods --------------
const emit = defineEmits(['show-start', 'show-end', 'hide-start', 'hide-end'])
const beforeEnter = () => {
	emit('show-start')
}
const afterEnter = () => {
	emit('show-end')
}
const beforeLeave = () => {
	emit('hide-start')
}
const afterLeave = () => {
	emit('hide-end')
}
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;

.transitionSlide-x-enter-active,
.transitionSlide-x-leave-active,
.transitionSlide-y-enter-active,
.transitionSlide-y-leave-active {
	transition-property: transform;
	transition-duration: var(--transitionSlide-duration);
	transition-delay: var(--transitionSlide-delay);
	transition-timing-function: ease-in-out;
	// transition: var.$transition-base;
}

.transitionSlide-x-enter-from {
	transform: translateX(var(--transitionSlide-x));
}

.transitionSlide-x-enter-to {
	transform: translateX(0);
}

.transitionSlide-x-leave-from {
	transform: translateX(0);
}

.transitionSlide-x-leave-to {
	transform: translateX(var(--transitionSlide-x));
}

.transitionSlide-y-enter-from {
	transform: translateY(var(--transitionSlide-y));
}

.transitionSlide-y-enter-to {
	transform: translateY(0);
}

.transitionSlide-y-leave-from {
	transform: translateY(0);
}

.transitionSlide-y-leave-to {
	transform: translateY(var(--transitionSlide-y));
}
</style>

<template>
	<ClientOnly>
		<Transition name="transitionFade" :style="variables" @after-enter="afterEnter" @after-leave="afterLeave">
			<slot />
		</Transition>
	</ClientOnly>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'

// Props -----------------------
const props = defineProps({
	duration: { type: [String, Number], default: 200 }, // ミリ秒
	delay: { type: [String, Number], default: 0 }, // ミリ秒
	easing: { type: String, default: 'ease-out' }, // イージング
})

// Data ------------------------
// props をリアクティブにする
const { duration, delay, easing } = toRefs(props)

// Computed --------------------
const variables = computed(() => {
	return {
		'--duration': `${duration.value}ms`,
		'--delay': `${delay.value}ms`,
		'--easing': `${easing.value}`,
	}
})

// Emits ----------------------
const emit = defineEmits(['show-end', 'hide-end'])

// Methods ----------------------
const afterEnter = () => {
	emit('show-end')
}
const afterLeave = () => {
	emit('hide-end')
}
</script>

<style lang="scss">
$cn: 'transitionFade'; // コンポーネントクラス名

.#{$cn}-enter-active,
.#{$cn}-leave-active {
	transition-property: opacity;
	transition-duration: var(--duration);
	transition-delay: var(--delay);
	transition-timing-function: var(--easing);
}

.#{$cn}-enter-from {
	opacity: 0;
}

.#{$cn}-enter-to {
	opacity: 1;
}

.#{$cn}-leave-from {
	opacity: 1;
}

.#{$cn}-leave-to {
	opacity: 0;
}
</style>

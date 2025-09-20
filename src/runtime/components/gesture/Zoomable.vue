<template>
	<div ref="element" class="zoomable" :style="calc ? {} : { transform: `scale(${scale})` }"
		@touchstart.passive="pinchStart" @touchmove.passive="zoom" @touchend="pinchEnd" @touchcancel="pinchEnd">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props ---------------------
const props = defineProps({
	modelValue: { type: Number, default: 1 },
	pinch: { type: Boolean, default: false }, // ジェスチャーのピンチイン・ピンチアウトを有効にするか
	calc: { type: Boolean, default: false }, // true: scale は変化させず、ズームを値だけにする
})

// Emits ---------------------
const emit = defineEmits(['update:modelValue'])
let prevDistance = 0

// Computed ---------------------
const scale = computed({
	get: () => props.modelValue,
	set: (value) => {
		emit('update:modelValue', value)
	},
})

// Methods ---------------------
const pinchStart = (event: TouchEvent) => {
	if (!props.pinch) return

	if (event.targetTouches.length === 2) {
		// Two fingers are touching.
		const dx = event.targetTouches[0].clientX - event.targetTouches[1].clientX
		const dy = event.targetTouches[0].clientY - event.targetTouches[1].clientY
		prevDistance = Math.sqrt(dx * dx + dy * dy)
	}
}

const zoom = (event: TouchEvent) => {
	if (event.targetTouches.length === 2) {
		// Two fingers are touching.
		const dx = event.targetTouches[0].clientX - event.targetTouches[1].clientX
		const dy = event.targetTouches[0].clientY - event.targetTouches[1].clientY
		const distance = Math.sqrt(dx * dx + dy * dy)

		if (prevDistance > 0) {
			scale.value += (distance - prevDistance) * 0.01
		}

		prevDistance = distance
	}
}

const pinchEnd = () => {
	prevDistance = 0 // Reset for the next zoom gesture.
}
</script>

<style lang="scss">
.zoomable {
	touch-action: none;
}
</style>

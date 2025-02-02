<template>
	<div class="draggable" :class="classes"
		:style="calc ? {} : { transform: `translate(${position.x}px, ${position.y}px)` }" @mousedown="startDrag"
		@mouseup="endDrag" @touchstart.passive="startDrag" @touchend="endDrag">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

// Types ---------------------
export type Position = { x: number, y: number }

// Emits ---------------------
const emit = defineEmits(['update:modelValue', 'dragging', 'endDrag'])

// Props ---------------------
const props = defineProps({
	disabledX: { type: Boolean, default: false }, // X軸の移動を許可するか
	disabledY: { type: Boolean, default: false }, // Y軸の移動を許可するか
	disabled: { type: Boolean, default: false },
	modelValue: { type: Object as () => Position, default: () => ({ x: 0, y: 0 }) },
	calc: { type: Boolean, default: false }, // 計算のみ
})

// Data ---------------------
const startX = ref(0)
const startY = ref(0)
const dragged = ref(false)

// Computed ---------------------
const position = computed({
	get: () => props.modelValue,
	set: (value: Position) => {
		emit('update:modelValue', value)
	},
})
const classes = computed(() => {
	return { _disabled: props.disabled }
})

// Methods ---------------------
const startDrag = (event: MouseEvent | TouchEvent) => {
	if (props.disabled) return

	document.body.addEventListener('mousemove', drag)
	document.body.addEventListener('touchmove', drag)
	document.body.addEventListener('mouseup', endDrag)
	document.body.addEventListener('touchend', endDrag)
	if ('touches' in event) {
		startX.value = event.touches[0].clientX - position.value.x
		startY.value = event.touches[0].clientY - position.value.y
	}
	else {
		startX.value = event.clientX - position.value.x
		startY.value = event.clientY - position.value.y
	}

	dragged.value = true
}

const drag = (event: MouseEvent | TouchEvent) => {
	if (!dragged.value) return

	let newX, newY
	if ('touches' in event) {
		newX = event.touches[0].clientX - startX.value
		newY = event.touches[0].clientY - startY.value
	}
	else {
		newX = event.clientX - startX.value
		newY = event.clientY - startY.value
	}

	if (props.disabledX) {
		newX = position.value.x
	}
	if (props.disabledY) {
		newY = position.value.y
	}

	position.value = { x: newX, y: newY }

	emit('dragging')
}

const endDrag = () => {
	document.body.removeEventListener('mousemove', drag)
	document.body.removeEventListener('mouseup', endDrag)
	document.body.removeEventListener('mouseup', endDrag)
	document.body.removeEventListener('touchend', endDrag)
	dragged.value = false
	emit('endDrag', { distanceX: position.value.x, distanceY: position.value.y })
}

// Lifecycle Hooks ---------------------
onUnmounted(() => {
	endDrag()
})
</script>

<style lang="scss">
.draggable {
	cursor: move;

	&>* {
		pointer-events: none;
		user-select: none;
	}

	&._disabled {
		cursor: default;
	}
}
</style>

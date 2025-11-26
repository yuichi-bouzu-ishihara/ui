<template>
	<Row class="pagenation" nowrap gap="0" align="center" justify="center">
		<Clickable v-for="i in total" :key="i" :disabled="disabled || i === current" @click="handleClick(i)"
			@mouseover="!disabled && (hoverIndex = i)" @mouseleave="!disabled && (hoverIndex = 0)">
			<Box p="4">
				<Box w="6" h="6" r="circle" :color="i === current || hoverIndex === i ? 'text' : 'text-030'" />
			</Box>
		</Clickable>
	</Row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Clickable from '../elements/Clickable.vue'
import Box from '../layout/Box.vue'
import Row from '../layout/Row.vue'

// Types --------------------------------------------------
export type Props = {
	current?: number
	total?: number
	disabled?: boolean
}

// Props --------------------------------------------------
withDefaults(defineProps<Props>(), {
	current: 0,
	total: 0,
	disabled: false,
})

// Emits --------------------------------------------------
const emit = defineEmits(['click-item'])

// Data --------------------------------------------------
const hoverIndex = ref(0)

const handleClick = (i: number) => {
	emit('click-item', i)
}
</script>

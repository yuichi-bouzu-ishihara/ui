<template>
	<Box class="sheetContainer" :class="classes" v-bind="box">
		<slot />
	</Box>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Box from '../layout/Box.vue'

// Constants --------------------------------
const PT = 0
const PB = 40
const PL = 28
const PR = 28

// Props --------------------------------
const props = defineProps({
	noPadding: { type: Boolean, default: false },
})

// Computed --------------------------------
const classes = computed(() => {
	return {
		_noPadding: props.noPadding,
	}
})
const box = computed(() => {
	return {
		w: '100%',
		maxW: '100%',
		pt: props.noPadding ? 0 : PT,
		pb: props.noPadding ? 0 : PB,
		pl: props.noPadding ? 0 : PL,
		pr: props.noPadding ? 0 : PR,
		ml: 'auto',
		mr: 'auto',
	}
})
</script>

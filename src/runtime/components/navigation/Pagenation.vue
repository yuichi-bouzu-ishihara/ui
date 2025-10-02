<template>
	<Row nowrap gap="8" align="center" justify="center">
		<Box v-for="i in total" :key="i" w="6" h="6" r="circle" :color="i === current ? 'text' : 'text-030'" />
	</Row>
</template>

<script setup lang="ts">
// Props --------------------------------------------------
defineProps({
	current: { type: Number, default: 0 },
	total: { type: Number, default: 0 },
})
</script>

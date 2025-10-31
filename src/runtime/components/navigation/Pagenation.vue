<template>
	<Row nowrap gap="8" align="center" justify="center">
		<Box v-for="i in total" :key="i" w="6" h="6" r="circle" :color="i === current ? 'text' : 'text-030'" />
	</Row>
</template>

<script setup lang="ts">
// Types --------------------------------------------------
export type Props = {
	current?: number
	total?: number
}

// Props --------------------------------------------------
withDefaults(defineProps<Props>(), {
	current: 0,
	total: 0,
})
</script>

<template>
	<div class="testModal" close @close="close(false)">
		<Center>
			<Typography title3 center color="light">
				{{ content }}
			</Typography>
		</Center>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Stores & Composables ---------------------------
const { options, close } = useModal()

// Computed -----------------------------------------------
const content = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('content' in options.value) {
			return options.value.content
		}
	}
	return ''
})
</script>

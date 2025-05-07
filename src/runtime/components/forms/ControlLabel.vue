<template>
	<Column class="controlLabel" gap="6">
		<Typography class="controlLabel-label" tag="label" caption1 bold :for="forId" unselectable cap-height-baseline>
			<template v-if="label">
				{{ label }}
			</template>
			<template v-else>
				<slot />
			</template>
		</Typography>
		<Typography v-if="description" caption3 color="text-060">
			<!-- eslint-disable-next-line vue/no-v-html -->
			<span v-html="description" />
		</Typography>
	</Column>
</template>

<script setup lang="ts">
import Typography from '../elements/Typography.vue'

// Props ------------------
defineProps({
	label: { type: String, default: '' },
	description: { type: String, default: '' },
	forId: { type: String, required: true },
})
</script>

<style lang="scss">
.controlLabel {
	&-label {
		cursor: pointer;
	}
}
</style>

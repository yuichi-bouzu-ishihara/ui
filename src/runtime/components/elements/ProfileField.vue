<template>
	<Column class="profileField" gap="8">
		<Typography font-size="10" bold cap-height-baseline color="text-050" lineclamp="1">
			{{ label }}
		</Typography>
		<Typography class="profileField-value" inherit cap-height-baseline linebreak>
			<!-- eslint-disable-next-line vue/no-v-html -->
			<span v-html="value" />
		</Typography>
		<IconButton v-if="hasEditHandler" class="profileField-ui" :icon="{ name: 'edit', size: 16 }"
			:color="{ background: 'transparent', text: 'dark' }" minimal xsmall no-padding @click="emit('edit')"
			@mouseover="hover = true" @mouseleave="hover = false" />
		<FieldFooter :focus="hover" />
	</Column>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue'

// Props ------------------
defineProps({
	label: { type: String, default: '' },
	value: { type: String, default: '' },
})

// Emits ------------------
const emit = defineEmits({
	edit: () => true,
})

// Data ------------------
const hover = ref(false)

// Computed -----------------------------------------------------
const hasEditHandler = computed(() => {
	const onEdit = getCurrentInstance()?.vnode.props?.onEdit
	return typeof onEdit === 'function'
})
</script>

<style lang="scss">
$cn: '.profileField';

#{$cn} {
	position: relative;

	&-value {
		padding-top: 0.2em;
		padding-bottom: 0.36em;
		padding-right: 32px;
	}

	&-ui {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}
}
</style>

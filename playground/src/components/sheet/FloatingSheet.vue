<template>
	<Sheet class="floatingSheet" :name="NAME" close v-bind="{ title, full, wide, narrow, center }"
		@close="close(NAME, false)">
		<SheetContainer>
			<Column justify="center" align="center" gap="20">
				<Icon name="edit" size="56" color="text" />
				<Typography font-size="18" bold center>
					FloatingSheet
				</Typography>
			</Column>
		</SheetContainer>
		<template #floating>
			<Box fixed bottom="40" right="0">
				<SheetContainer>
					<IconButton :icon="{ name: 'edit' }" @click="close(NAME, false)" />
				</SheetContainer>
			</Box>
		</template>
	</Sheet>
</template>

<script setup lang="ts">
// Constants ---------------------------
const NAME = 'floating'

// Composables ---------------------------
const { getOptions, close } = useSheet()

// Computed -----------------------------------------------
const options = computed(() => getOptions(NAME))
const title = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('title' in options.value) {
			return options.value.title as string
		}
	}
	return ''
})
const full = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('full' in options.value) {
			return options.value.full as boolean
		}
	}
	return false
})
const wide = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('wide' in options.value) {
			return options.value.wide as boolean
		}
	}
	return false
})
const narrow = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('narrow' in options.value) {
			return options.value.narrow as boolean
		}
	}
	return false
})
const center = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('center' in options.value) {
			return options.value.center as boolean
		}
	}
	return false
})
</script>

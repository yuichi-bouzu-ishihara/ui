<template>
	<Sheet class="nest1Sheet" :name="NAME" v-bind="{ title, full, wide, narrow, center }">
		<template #header-right>
			<Button xsmall rounded @click="close(NAME, false)">
				close
			</Button>
		</template>
		<SheetContainer>
			<Column justify="center" align="end" gap="20">
				<template v-if="icon">
					<Icon class="nest1Sheet-icon" :name="icon" size="56" color="text" />
				</template>
				<template v-if="content">
					<Typography font-size="18" bold center>
						<!-- eslint-disable-next-line vue/no-v-html -->
						<span v-html="content" />
					</Typography>
				</template>
				<Box w="100%" mt="12" mb="-8">
					<Button w="100%" @click="nest">
						Nest -2-
					</Button>
				</Box>
			</Column>
		</SheetContainer>
	</Sheet>
</template>

<script setup lang="ts">
// Constants ---------------------------
const NAME = 'nest1'

// Stores & Composables ---------------------------
const { open, getOptions, close } = useSheet()

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
const icon = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('icon' in options.value) {
			return options.value.icon as string
		}
	}
	return ''
})
const content = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('content' in options.value) {
			return options.value.content as string
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

// Methods -----------------------------------------------
const nest = () => {
	open({
		name: 'nest2',
		options: {
			title: 'Nest -2-',
			full: true,
			center: true,
		},
	})
}
</script>

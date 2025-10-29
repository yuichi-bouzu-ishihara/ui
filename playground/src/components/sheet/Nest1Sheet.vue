<template>
	<Sheet class="nest1Sheet" :name="NAME" v-bind="{ title, full, wide, narrow, center }">
		<template #header-right>
			<Button xsmall rounded @click="close(NAME, false)">
				close
			</Button>
		</template>
		<Column justify="center" gap="20">
			<Icon v-if="icon" class="nest1Sheet-icon" :name="icon" size="56" color="text" />
			<Container wide>
				<Box relative>
					<Box v-if="!isImageReady" w="100%" h="200">
						<SkeletonShape w="100%" h="100%" />
					</Box>
					<Image src="https://picsum.photos/1000/200" @ready="isImageReady = true" />
				</Box>
			</Container>
			<Container v-if="content">
				<Typography font-size="18" bold center>
					<!-- eslint-disable-next-line vue/no-v-html -->
					<span v-html="content" />
				</Typography>
			</Container>
			<Container>
				<Column justify="center" gap="8">
					<Button w="100%" @click="addContent">
						Add Content
					</Button>
					<Button w="100%" @click="nest">
						Nest -2-
					</Button>
				</Column>
			</Container>
		</Column>
		<Box h="40" />
	</Sheet>
</template>

<script setup lang="ts">
// Constants ---------------------------
const NAME = 'nest1'

// Stores & Composables ---------------------------
const { open, getOptions, close } = useSheet()

// Data -----------------------------------------------
const content = ref('')
const isImageReady = ref(false)

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
	return 'info'
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
const addContent = () => {
	content.value += content.value
}

// Lifecycle -----------------------------------------------
onMounted(() => {
	if (options.value && typeof options.value === 'object') {
		if ('content' in options.value) {
			content.value = options.value.content as string
		}
	}
})
</script>

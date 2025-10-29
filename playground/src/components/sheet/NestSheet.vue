<template>
	<Sheet class="nest1Sheet" :name="NAME" v-bind="{ title, full, wide, narrow, center }">
		<template #header-right>
			<Button xsmall rounded @click="close($attrs.index as number, false)">
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
					<Image :src="`https://picsum.photos/1000/200?t=${mountedTime}`" @ready="isImageReady = true" />
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
						Add NestSheet
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

// Composables ---------------------------
const { open, close, list } = useSheet()

// Props -----------------------------------------------
const props = defineProps({
	title: { type: String, default: '' },
	icon: { type: String, default: '' },
	content: { type: String, default: '' },
	full: { type: Boolean, default: false },
	wide: { type: Boolean, default: false },
	narrow: { type: Boolean, default: false },
	center: { type: Boolean, default: false },
})

// Data -----------------------------------------------
const text = ref('')
const isImageReady = ref(false)
const mountedTime = ref(0)

// Methods -----------------------------------------------
const nest = () => {
	open({
		component: 'NestSheet',
		props: {
			title: `Nest -index: ${list.value.length - 1}-`,
			full: true,
			center: true,
			content: text.value,
		},
	})
}
const addContent = () => {
	text.value += text.value
}

// Lifecycle -----------------------------------------------
onMounted(() => {
	if (props.content) {
		text.value = props.content
	}
	mountedTime.value = new Date().getTime()
})
</script>

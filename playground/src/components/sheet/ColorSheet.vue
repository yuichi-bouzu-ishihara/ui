<template>
	<Sheet class="colorSheet" :name="NAME" :color="{ background: backgroundColor, text: textColor }" close
		v-bind="{ title, full, wide, narrow, center }" @close="close(NAME, false)">
		<SheetContainer>
			<Box w="100%" h="1000" :style="{ backgroundImage: 'url(https://picsum.photos/1000/1000)' }" />
			<Column justify="center" align="end" gap="20">
				<template v-if="icon">
					<Icon class="nest1Sheet-icon" :name="icon" size="56" :color="textColor.replace('color-', '')" />
				</template>
				<template v-if="content">
					<Typography font-size="18" bold center :color="textColor.replace('color-', '')">
						<!-- eslint-disable-next-line vue/no-v-html -->
						<span v-html="content" />
					</Typography>
				</template>
				<Box w="100%" mt="12" mb="-8">
					<Row split="3" gap="20" nowrap>
						<Button @click="black">
							Black
						</Button>
						<Button @click="white">
							White
						</Button>
						<Button @click="red">
							Red
						</Button>
					</Row>
				</Box>
			</Column>
		</SheetContainer>
	</Sheet>
</template>

<script setup lang="ts">
// Constants ---------------------------
const NAME = 'color'
const BACKGROUND_COLOR = '#0000ff' // color-${name}, #hex, rgb(r,g,b), rgba(r,g,b,a)
const TEXT_COLOR = '#ff0000' // color-${name}, #hex, rgb(r,g,b), rgba(r,g,b,a)

// Composables ---------------------------
const { getOptions, close } = useSheet()

// Data -----------------------------------------------
const backgroundColor = ref(BACKGROUND_COLOR)
const textColor = ref(TEXT_COLOR)

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
const black = () => {
	backgroundColor.value = '#000000'
	textColor.value = '#ffffff'
}
const white = () => {
	backgroundColor.value = '#ffffff'
	textColor.value = '#000000'
}
const red = () => {
	backgroundColor.value = '#ff0000'
	textColor.value = '#ffffff'
}
</script>

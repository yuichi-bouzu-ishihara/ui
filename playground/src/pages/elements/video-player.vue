<template>
	<Container>
		<FileUpload v-if="!file" v-model="file" accept=".mp4" :max-size="1024 * 1024 * 1024" />
		<Column v-else-if="src" gap="20">
			<VideoPlayer v-model:muted="muted" v-bind="{ src, controls }" />
			<Row justify="center" gap="20">
				<Clickable @click="muted = !muted">
					<Icon :name="muted ? 'volumeOff' : 'volume'" size="20" />
				</Clickable>
			</Row>
			<Row justify="center" gap="20" nowrap>
				<Switch v-model="ctrPlayPause" name="ctrPlayPause" label="Play & Pause" />
				<Switch v-model="ctrVolumeMute" name="ctrVolumeMute" label="Volume & Mute" />
				<Switch v-model="ctrSeekbar" name="ctrSeekbar" label="Seek Bar" />
				<Switch v-model="ctrTime" name="ctrTime" label="Time" />
			</Row>
		</Column>
	</Container>
</template>

<script setup>
// Data -------------------------------------------
const file = ref(null)
const src = ref('')
const muted = ref(false)
const ctrPlayPause = ref(true)
const ctrVolumeMute = ref(true)
const ctrSeekbar = ref(true)
const ctrTime = ref(true)

// Computed -------------------------------------------
const controls = computed(() => {
	const result = [
		ctrPlayPause.value ? 'play' : '',
		ctrVolumeMute.value ? 'volume' : '',
		ctrSeekbar.value ? 'seekbar' : '',
		ctrTime.value ? 'time' : '',
	].filter(Boolean)
	return result.length === 0 ? false : result
})

// Watch -------------------------------------------
watch(() => file.value, async (newVal) => {
	if (newVal) {
		src.value = URL.createObjectURL(newVal)
	}
})
</script>

<style lang="scss"></style>

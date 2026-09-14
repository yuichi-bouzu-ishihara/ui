<template>
	<Container>
		<FileUpload v-if="!file" v-model="file" accept=".mp4" :max-size="1024 * 1024 * 1024" />
		<Column v-else-if="src" gap="20">
			<VideoPlayer v-model:muted="muted" v-model:current-time="currentTime" v-bind="{ src, controls, loop, playsinline }"
				:always-show-controls="ctrAlwaysShowControls" @ended="onEnded" />
			<Row justify="center" gap="20" nowrap>
				<Switch v-model="ctrPlayPause" name="ctrPlayPause" label="Play & Pause" />
				<Switch v-model="ctrVolumeMute" name="ctrVolumeMute" label="Volume & Mute" />
				<Switch v-model="ctrSeekbar" name="ctrSeekbar" label="Seek Bar" />
				<Switch v-model="ctrTime" name="ctrTime" label="Time" />
				<Switch v-model="ctrAlwaysShowControls" name="ctrAlwaysShowControls" label="Always Show Controls" />
			</Row>
			<Row justify="center" gap="20" nowrap>
				<Switch v-model="loop" name="loop" label="Loop" />
				<Switch v-model="playsinline" name="playsinline" label="Playsinline" />
			</Row>
			<Typography v-if="endedCount > 0" center>
				ended を {{ endedCount }} 回受け取りました
			</Typography>

			<!-- cover / background。Ratio を通さず親の大きさいっぱいに敷く -->
			<Typography bold>
				cover / background（親の大きさに追従する）
			</Typography>
			<Box w="100%" h="240" relative>
				<VideoPlayer v-bind="{ src }" cover background muted loop autoplay />
			</Box>

			<!-- autopause。片方を再生するともう片方が止まる -->
			<Typography bold>
				autopause（片方を再生するともう片方が止まる）
			</Typography>
			<Row gap="20" nowrap>
				<VideoPlayer v-bind="{ src }" autopause :controls="['play']" always-show-controls />
				<VideoPlayer v-bind="{ src }" autopause :controls="['play']" always-show-controls />
			</Row>

			<Button @click="onExtractThumbnail">
				Extract Thumbnail
			</Button>
			<Image v-if="thumbnailBase64" :src="thumbnailBase64" contain />
		</Column>
	</Container>
</template>

<script setup>
// Composables -------------------------------------------
const { extractThumbnailAtTime } = useVideoThumbnail()

// Data -------------------------------------------
const file = ref(null)
const src = ref('')
const muted = ref(false)
const currentTime = ref(0)
const ctrPlayPause = ref(true)
const ctrVolumeMute = ref(true)
const ctrSeekbar = ref(true)
const ctrTime = ref(true)
const ctrAlwaysShowControls = ref(false)
const loop = ref(false)
const playsinline = ref(true)
const endedCount = ref(0)
const thumbnailBase64 = ref('')

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

// Methods -------------------------------------------
const onExtractThumbnail = async () => {
	const thumbnail = await extractThumbnailAtTime(src.value, currentTime.value, { format: 'image/webp' })
	thumbnailBase64.value = thumbnail
}

const onEnded = () => {
	endedCount.value += 1
}

// Watch -------------------------------------------
watch(() => file.value, async (newVal) => {
	if (newVal) {
		src.value = URL.createObjectURL(newVal)
	}
})
</script>

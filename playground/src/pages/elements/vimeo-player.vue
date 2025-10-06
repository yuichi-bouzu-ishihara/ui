<template>
	<Box class="pageElementsVimeoPlayer">
		<Container v-if="!videoId" gap="20">
			<Input v-model="videoId" name="videoId" label="Vimeo Video ID" placeholder="e.g. 1123117748" focus />
			<FieldFooter focus description="Please enter the Vimeo Video ID." />
		</Container>
		<Column v-else gap="20">
			<Container wide>
				<Box v-if="!isMetadataLoaded" w="100%" h="100%" relative>
					<Ratio golden>
						<SkeletonShape animation w="100%" h="100%" />
					</Ratio>
					<Box absolute top="0" left="0" bottom="0" right="0">
						<Center>
							<Spinner />
						</Center>
					</Box>
				</Box>
				<VimeoPlayer v-bind="{ videoId, autoplay }" ref="vimeoPlayer" v-model:current-time="currentTime"
					v-model:seeking="isSeeking" v-model:volume="volume" v-model:mute="mute"
					:style="`opacity: ${isMetadataLoaded ? 1 : 0}`" style="width: 100%; height: 100%;" controls @ready="onReady"
					@play="onPlay" @pause="onPause" @ended="onEnded" @error="onError" @metadataloaded="onLoaded"
					@bufferend="onBufferEnd" @bufferstart="onBufferStart" @playbackratechange="onPlaybackRateChange"
					@progress="onProgress" @seeked="onSeeked" @timeupdate="onTimeUpdate" @volumechange="onVolumeChange" />
			</Container>
			<Container>
				<Column gap="20" justify="stretch" fit-w>
					<Row align="center" gap="20" fit-w nowrap>
						<Box w="200">
							<Typography caption3 bold center>
								{{ new Date((currentTime || 0) * 1000).toISOString().substr(11, 8) }} / {{ new Date(duration
									* 1000).toISOString().substr(11, 8) }}
							</Typography>
						</Box>
						<Box w="100%">
							<InputRange v-model="currentTime" min="0" :max="duration" step="0.1" @mousedown="isSeeking = true"
								@mouseup="isSeeking = false" />
						</Box>
					</Row>
					<Row split="2" gap="20">
						<Button @click="play">
							Play
						</Button>
						<Button @click="pause">
							Pause
						</Button>
					</Row>
					<Row align="center" gap="20" fit-w nowrap>
						<Clickable @click="mute = !mute">
							<Icon :name="mute ? 'volumeOff' : 'volume'" size="20" />
						</Clickable>
						<Box w="100%">
							<InputRange v-model="volume" min="0" max="1" step="0.1" />
						</Box>
					</Row>
				</Column>
			</Container>
		</Column>
		<Container>
			<Box h="20" />
			<Row justify="center">
				<Switch v-model="autoplay" name="autoplay" label="Autoplay" />
			</Row>
		</Container>
	</Box>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ReadyEvent, TimeUpdateEvent, VolumeChangeEvent, VimeoPlayerInstance } from '../../../src/runtime/components/elements/VimeoPlayer.vue'

const vimeoPlayer = ref<VimeoPlayerInstance>()
const videoId = ref('')
const currentTime = ref(0)
const seekTime = ref(0)
const isSeeking = ref(false)
const duration = ref(0)
const volume = ref(0.25)
const mute = ref(false)
const isReady = ref(false)
const isMetadataLoaded = ref(false)
const autoplay = ref(true)

const play = () => {
	vimeoPlayer.value?.play()
}
const pause = () => {
	vimeoPlayer.value?.pause()
}
const onReady = (evt: ReadyEvent) => {
	// console.log('ready', evt)
	duration.value = evt.duration
	isReady.value = true
}
const onPlay = () => {
	// console.log('play')
}
const onPause = () => {
	// console.log('pause')
}
const onEnded = () => {
	// console.log('ended')
}
const onError = () => {
	// console.log('error')
}
const onLoaded = () => {
	// console.log('loaded')
	isMetadataLoaded.value = true
}
const onBufferEnd = () => {
	// console.log('bufferend')
}
const onBufferStart = () => {
	// console.log('bufferstart')
}
const onPlaybackRateChange = () => {
	// console.log('playbackratechange')
}
const onProgress = () => {
	// console.log('progress')
}
const onSeeked = () => {
	// console.log('seeked')
}
const onTimeUpdate = (evt: TimeUpdateEvent) => {
	// console.log('timeupdate', evt)
	seekTime.value = evt.currentTime
}
const onVolumeChange = (_evt: VolumeChangeEvent) => {
	// console.log('volumechange', evt)
}
</script>

<style lang="scss"></style>

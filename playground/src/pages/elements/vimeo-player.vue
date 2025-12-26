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
				<Ratio golden>
					<VimeoPlayer v-bind="{ videoId, autoplay, loop, cover }" ref="vimeoPlayer" v-model:current-time="currentTime"
						v-model:seeking="isSeeking" v-model:volume="volume" v-model:muted="muted"
						:style="`opacity: ${isMetadataLoaded ? 1 : 0}`" controls contain @ready="onReady" @play="onPlay"
						@pause="onPause" @ended="onEnded" @error="onError" @metadataloaded="onLoaded" @bufferend="onBufferEnd"
						@bufferstart="onBufferStart" @playbackratechange="onPlaybackRateChange" @progress="onProgress"
						@seeked="onSeeked" @timeupdate="onTimeUpdate" @volumechange="onVolumeChange" />
				</Ratio>
			</Container>
		</Column>
		<Container>
			<Box h="20" />
			<Row justify="center" gap="40">
				<Switch v-model="autoplay" name="autoplay" label="Autoplay" />
				<Switch v-model="loop" name="loop" label="Loop" />
				<Switch v-model="cover" name="cover" label="Cover" />
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
const muted = ref(false)
const isReady = ref(false)
const isMetadataLoaded = ref(false)
const autoplay = ref(false)
const loop = ref(false)
const cover = ref(false)

const onReady = (evt: ReadyEvent) => {
	console.log('ready', evt)
	duration.value = evt.duration
	isReady.value = true
}
const onPlay = () => {
	console.log('play')
}
const onPause = () => {
	console.log('pause')
}
const onEnded = () => {
	console.log('ended')
}
const onError = () => {
	console.log('error')
}
const onLoaded = () => {
	console.log('loaded')
	isMetadataLoaded.value = true
}
const onBufferEnd = () => {
	console.log('bufferend')
}
const onBufferStart = () => {
	console.log('bufferstart')
}
const onPlaybackRateChange = () => {
	console.log('playbackratechange')
}
const onProgress = () => {
	console.log('progress')
}
const onSeeked = () => {
	console.log('seeked')
}
const onTimeUpdate = (evt: TimeUpdateEvent) => {
	console.log('timeupdate', evt)
	seekTime.value = evt.currentTime
}
const onVolumeChange = (_evt: VolumeChangeEvent) => {
	console.log('volumechange', _evt)
}
</script>

<style lang="scss"></style>

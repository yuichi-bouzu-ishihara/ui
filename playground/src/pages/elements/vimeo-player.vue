<template>
	<Box class="pageElementsVimeoPlayer" w="100vw" h="100vh">
		<Center>
			<Container narrow>
				<VimeoPlayer v-bind="{ videoId: 1074471464 }" thumbnail-url="/assets/imgs/genzu.jpg" @play="onPlay"
					@pause="onPause" @ended="onEnded" @error="onError" @loaded="onLoaded" @bufferend="onBufferEnd"
					@bufferstart="onBufferStart" @playbackratechange="onPlaybackRateChange" @progress="onProgress"
					@seeked="onSeeked" @timeupdate="onTimeUpdate" @volumechange="onVolumeChange" />
			</Container>
		</Center>
	</Box>
</template>

<script setup lang="ts">
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
const onTimeUpdate = () => {
	console.log('timeupdate')
}
const onVolumeChange = () => {
	console.log('volumechange')
}
</script>

<style lang="scss"></style>

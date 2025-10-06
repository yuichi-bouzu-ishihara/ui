<template>
	<div class="videoPlayerControls">
		<Box absolute top="0" left="0" right="0" bottom="0">
			<Clickable class="videoPlayerControls-play" @click="isPlaying ? emit('pause') : emit('play')">
				<Center>
					<Spinner v-if="isBuffering" size="40" color="light" />
					<Icon v-else-if="!isPlaying" name="play" size="40" color="light" />
					<Icon v-else name="pause" size="40" color="light" />
				</Center>
			</Clickable>
		</Box>
		<Box class="videoPlayerControls-footer" absolute bottom="0" left="0" right="0" p="0 20px 24px">
			<Column gap="12">
				<Row justify="between" align="center" nowrap>
					<Row nowrap>
						<Typography font-size="12" bold cap-height-baseline color="light">
							{{ formatTime(currentTime || 0) }}
						</Typography>
						<Typography font-size="12" bold cap-height-baseline color="light-060">
							&nbsp;/&nbsp;{{ formatTime(duration) }}
						</Typography>
					</Row>
					<Clickable @click="mute = !mute">
						<Icon v-if="!mute" name="volume" size="20" color="light" />
						<Icon v-else name="volumeOff" size="20" color="light" />
					</Clickable>
				</Row>
				<InputRange v-model="currentTime" :min="0" :max="duration || 1" :step="0.01" :color="{
					handle: 'var(--color-light)', bar: 'var(--color-light)', barBackground: 'var(--color-light-020)',
				}" @mousedown="seeking = true" @mouseup="seeking = false" />
			</Column>
		</Box>
	</div>
</template>

<script setup lang="ts">
import { useVideo } from '../../composables/elements/video'

// Composables --------------
const { formatTime } = useVideo()

// Models --------------
const mute = defineModel<boolean>('mute', { default: false })
const currentTime = defineModel<number>('current-time', { default: 0 })
const seeking = defineModel<boolean>('seeking', { default: false })

// Props --------------
defineProps({
	duration: { type: Number, default: 1 },
	isPlaying: { type: Boolean, default: false },
	isBuffering: { type: Boolean, default: true },
})

// Emits --------------
const emit = defineEmits(['play', 'pause', 'mute'])
</script>

<style lang="scss">
$cn: '.videoPlayerControls';

#{$cn} {
	position: relative;
	width: 100%;
	background-color: var(--color-darkblack-030);

	&-play {
		width: 100%;
		height: 100%;
	}
}
</style>

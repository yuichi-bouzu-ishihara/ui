<template>
	<div class="videoPlayerControls">
		<Box absolute top="0" left="0" right="0" bottom="0">
			<Clickable class="videoPlayerControls-play" @click="isPlaying ? emit('pause') : emit('play')">
				<Center v-if="!isBuffering">
					<Icon v-if="!isPlaying" name="play" size="40" color="light" />
					<Icon v-else name="pause" size="40" color="light" />
				</Center>
			</Clickable>
		</Box>
		<Box class="videoPlayerControls-footer" absolute bottom="0" left="0" right="0" p="0 20px 24px">
			<Column gap="12">
				<Row justify="between" align="end" nowrap>
					<Box pb="4">
						<Row nowrap>
							<Typography font-size="12" bold cap-height-baseline color="light">
								{{ formatTime(currentTime || 0) }}
							</Typography>
							<Typography font-size="12" bold cap-height-baseline color="light-060">
								&nbsp;/&nbsp;{{ formatTime(duration) }}
							</Typography>
						</Row>
					</Box>
					<Column justify="center" gap="8" @mouseleave="isHoverMute = false">
						<TransitionFade>
							<Box v-if="isHoverMute && !muted" h="80">
								<InputRangeVertical v-model="volume" :min="0" :max="1" :step="0.01" :color="{
									handle: 'var(--color-light)', bar: 'var(--color-light)', barBackground: 'var(--color-light-020)',
								}" handle-size="12" />
							</Box>
						</TransitionFade>
						<Clickable @mouseover="isHoverMute = true" @click="muted = !muted">
							<Icon v-if="!muted" name="volume" size="20" color="light" />
							<Icon v-else name="volumeOff" size="20" color="light" />
						</Clickable>
					</Column>
				</Row>
				<InputRange v-model="currentTime" :min="0" :max="duration || 1" :step="0.01" :color="{
					handle: 'var(--color-light)', bar: 'var(--color-light)', barBackground: 'var(--color-light-020)',
				}" @mousedown="seeking = true" @mouseup="seeking = false" />
			</Column>
		</Box>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputRange from '../forms/InputRange.vue'
import InputRangeVertical from '../forms/InputRangeVertical.vue'
import { useVideo } from '../../composables/elements/video'
import Box from '../layout/Box.vue'
import Column from '../layout/Column.vue'
import Row from '../layout/Row.vue'
import Typography from '../elements/Typography.vue'
import Icon from '../elements/Icon.vue'
import Clickable from '../elements/Clickable.vue'
import TransitionFade from '../transition/TransitionFade.vue'

// Composables --------------
const { formatTime } = useVideo()

// Models --------------
const currentTime = defineModel<number>('current-time', { default: 0 })
const seeking = defineModel<boolean>('seeking', { default: false })
const muted = defineModel<boolean>('muted', { default: false })
const volume = defineModel<number>('volume', { default: 0.5 })

// Props --------------
defineProps({
	duration: { type: Number, default: 1 },
	isPlaying: { type: Boolean, default: false },
	isBuffering: { type: Boolean, default: true },
})

// Emits --------------
const emit = defineEmits(['play', 'pause'])

// Data --------------
const isHoverMute = ref(false)
</script>

<style lang="scss">
$cn: '.videoPlayerControls';

#{$cn} {
	position: relative;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.3);

	&-play {
		width: 100%;
		height: 100%;
	}
}
</style>

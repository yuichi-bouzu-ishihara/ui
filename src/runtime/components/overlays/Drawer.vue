<template>
	<Box class="drawer" absolute top="0" z-index="1" w="100%" disabled>
		<Box animation :style="depthStyle">
			<Box class="drawer-inner" :w="`calc(50% - ${baseAbove() ? useContainer().base ?? 0 : 0
				} / 2)`" min-w="320" :h="height" v-bind="box" :color="darkmode ? 'dark' : 'light'" relative>
				<slot />
			</Box>
		</Box>
	</Box>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDrawer } from '../../composables/overlays/drawer'
import { useBreakPoint } from '../../composables/break-point'
import { useCss } from '../../composables/css'
import { useViewport } from '../../composables/viewport'
import { useMode } from '../../composables/mode'
import { useContainer } from '../../composables/layout/container'
import Box from '../layout/Box.vue'

// Composables ----------------------------
const { baseAbove } = useBreakPoint()
const { getSize } = useCss()
const { height } = useViewport()
const { darkmode } = useMode()
const { get, lefts, rights } = useDrawer()

// Props ----------------------------
const props = defineProps({
	name: { type: String, default: '' },
})

// Computed ----------------------------
const left = computed(() => {
	const { drawer } = get(props.name)
	return drawer?.from === 'left'
})
const right = computed(() => {
	const { drawer } = get(props.name)
	return drawer?.from === 'right'
})
const index = computed(() => {
	const { index } = get(props.name)
	return index
})
const box = computed(() => {
	let style = {}
	if (left.value) {
		style = { mr: 'auto' }
	}
	else if (right.value) {
		style = { ml: 'auto' }
	}
	return style
})

// 階層を深く見せるスタイル
const depthStyle = computed(() => {
	let depth = 0
	let x = 0
	let scale = 1
	let brightness = 0
	let transformOrigin = ''
	if (left.value) {
		depth = lefts.value.length - 1
		x = 8 * (depth - index.value)
		transformOrigin = 'center right'
	}
	else if (right.value) {
		depth = rights.value.length - 1
		x = -8 * (depth - index.value)
		transformOrigin = 'center left'
	}
	scale = 1 - (depth - index.value) * 0.04
	brightness = 1 - (depth - index.value) * 0.25

	return { transformOrigin, transform: `translateX(${getSize(x)}) scale(${scale})`, filter: `brightness(${brightness})` }
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_functions.scss' as func;
@use '../../scss/_mixins.scss' as mix;
$cn: '.drawer'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		&-inner {
			user-select: none;
			pointer-events: auto;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

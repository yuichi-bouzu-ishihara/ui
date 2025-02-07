<template>
	<Box class="drawerLayer" w="100%" fixed top="0" left="0" z-index="100">
		<TransitionGroup name="drawer-left">
			<template v-if="lefts.length">
				<slot />
			</template>
		</TransitionGroup>
		<TransitionGroup name="drawer-right">
			<template v-if="rights.length">
				<slot />
			</template>
		</TransitionGroup>
		<TransitionFade>
			<Box v-if="lefts.length + rights.length > 0" fixed top="0" left="0" w="100%" h="100%" z-index="0">
				<Backdrop soft @click="closeOne" />
			</Box>
		</TransitionFade>
	</Box>
</template>

<script setup lang="ts">
import { /* computed, */ watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDrawer } from '../../composables/overlays/drawer'
// import { useCss } from '../../composables/css'
import TransitionFade from '../transition/TransitionFade.vue'
import Box from '../layout/Box.vue'
import Backdrop from './Backdrop.vue'
// import Drawer from './Drawer.vue'

// Composables ---------------------------
const { lefts, rights, closeOne, closeAll } = useDrawer()
// const { getSize } = useCss()
const route = useRoute()

// Computed -------------------------
// 階層を深く見せるスタイル
// const leftDepthStyle = computed(() => (index: number) => {
// 	const depth = lefts.value.length - 1
// 	const scale = 1 - (depth - index) * 0.04
// 	const x = 8 * (depth - index)
// 	const brightness = 1 - (depth - index) * 0.25
// 	return { transform: `transform-origin: center right; translateX(${getSize(x)}) scale(${scale})`, filter: `brightness(${brightness})` }
// })
// const rightDepthStyle = computed(() => (index: number) => {
// 	const depth = rights.value.length - 1
// 	const scale = 1 - (depth - index) * 0.04
// 	const x = -8 * (depth - index)
// 	const brightness = 1 - (depth - index) * 0.25
// 	return { transform: `translateX(${getSize(x)}) scale(${scale})`, filter: `brightness(${brightness})` }
// })

// Watchers -------------------------
watch(
	() => route.path,
	(newPath, oldPath) => {
		if (newPath != oldPath) {
			// ページ遷移時にはすべて閉じる
			closeAll()
		}
	},
)
</script>

<style lang="scss">
.drawer-left-enter-active,
.drawer-left-leave-active,
.drawer-right-enter-active,
.drawer-right-leave-active {
	transition: transform 0.25s ease;
}

.drawer-right-enter-from,
.drawer-right-leave-to {
	transform: translateX(100%);
}

.drawer-left-enter-from,
.drawer-left-leave-to {
	transform: translateX(-100%);
}
</style>

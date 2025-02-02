<template>
	<div ref="element" :class="`sheetLayer${isOpen ? ' _open' : ''}`">
		<TransitionSlide from="bottom" @hide-end="isOpen = false">
			<div v-if="name !== ''" ref="innerEl" class="sheetLayer-inner">
				<div class="sheetLayer-inner-item">
					<SheetDevMenu v-if="name === 'devMenu'" />
					<SheetMessage v-if="name === 'message'" />
					<slot />
				</div>
			</div>
		</TransitionSlide>
		<TransitionFade>
			<Backdrop v-if="name !== ''" class="sheetLayer-overlay" soft @click="close(false)" />
		</TransitionFade>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSheet } from '../../composables/overlays/sheet'
import TransitionSlide from '../transition/TransitionSlide.vue'
import TransitionFade from '../transition/TransitionFade.vue'
import SheetMessage from './SheetMessage.vue'
import SheetDevMenu from './SheetDevMenu.vue'
import Backdrop from './Backdrop.vue'

// Stores & Composables ---------------------------
const { close, name, isOpen, scrollY } = useSheet()
const route = useRoute()

// Data ---------------------------
const element = ref<HTMLDivElement | null>(null)
const innerEl = ref<HTMLDivElement | null>(null)

// Methods -------------------------
const handleScroll = () => {
	scrollY.value = element.value?.scrollTop || 0
}

// Watchers -------------------------
watch(
	() => route.path,
	(newPath, oldPath) => {
		if (newPath != oldPath) {
			// ページ遷移時に閉じる
			close()
		}
	},
)

// Lifecycle Hooks -------------------------
onMounted(() => {
	element.value?.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
	element.value?.removeEventListener('scroll', handleScroll)
	scrollY.value = 0
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.sheetLayer'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		overflow-y: scroll;

		&._open {
			height: 100%;
		}

		&-inner {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			min-height: 100%;
			height: auto;
			pointer-events: none;
			padding-top: func.get-size(var.$header-height);

			&-item {
				width: 100%;

				&>* {
					pointer-events: auto;
				}
			}
		}

		&-overlay {
			z-index: -1;
		}

		@include mix.breakpoint('base') {
			&-inner {
				align-items: center;
				padding-bottom: func.get-size(var.$header-height);
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {
		&-inner {
			padding-top: func.get-size(var.$header-height, false);
		}

		@include mix.breakpoint('base') {
			&-inner {
				padding-bottom: func.get-size(var.$header-height, false);
			}
		}
	}
}
</style>

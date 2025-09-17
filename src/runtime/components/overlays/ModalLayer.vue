<template>
	<div :class="`modalLayer${isOpen ? ' _open' : ''}`">
		<div v-if="name !== ''" ref="innerEl" class="modalLayer-inner">
			<slot />
		</div>
		<TransitionFade>
			<Backdrop v-if="name !== ''" class="modalLayer-overlay" v-bind="backdropBind" @click="close(false)" />
		</TransitionFade>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useModal } from '../../composables/overlays/modal'
import TransitionFade from '../transition/TransitionFade.vue'
import Backdrop from './Backdrop.vue'

// Stores & Composables ---------------------------
const { close, name, isOpen, backdrop, blur } = useModal()
const route = useRoute()

// Data ---------------------------
const innerEl = ref<HTMLDivElement | null>(null)

// Computed -------------------------
const backdropBind = computed(() => ({
	ultraSoft: backdrop.value === 'ultraSoft',
	soft: backdrop.value === 'soft',
	medium: backdrop.value === 'medium',
	hard: backdrop.value === 'hard',
	solid: backdrop.value === 'solid',
	blur: blur.value,
}))

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
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.modalLayer'; // コンポーネントセレクタ名

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
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			pointer-events: none;
			padding-top: var(--header-height);
			padding-bottom: var(--header-height);

			&>* {
				pointer-events: auto;
			}
		}

		&-overlay {
			z-index: -1;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

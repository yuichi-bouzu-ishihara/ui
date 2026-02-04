<template>
	<div :class="`modalLayer${isOpen ? ' _open' : ''}`">
		<div v-if="component !== ''" class="modalLayer-inner">
			<component :is="basics[component]" v-if="basics[component]" v-bind="currentProps" />
			<slot v-else />
		</div>
		<TransitionFade>
			<Backdrop v-if="component !== ''" class="modalLayer-overlay" v-bind="backdropBind" @click="close(false)" />
		</TransitionFade>
	</div>
</template>

<script setup lang="ts">
import { watch, computed, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { useModal } from '../../composables/overlays/modal'
import TransitionFade from '../transition/TransitionFade.vue'
import Backdrop from './Backdrop.vue'

// Composables ---------------------------
const { close, component, isOpen, backdrop, blur, props: currentProps } = useModal()
const route = useRoute()

// Props ---------------------------
const props = defineProps<{
	components?: Record<string, Component>
}>()

// Computed -------------------------
// 表示するモーダルコンポーネントを定義する（propsから受け取る）
const basics = computed<Record<string, Component>>(() => {
	return props.components || {}
})
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

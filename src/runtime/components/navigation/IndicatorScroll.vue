<template>
	<div class="indicatorScroll">
		<Box class="indicatorScroll-bg" v-bind="{ color }" />
		<Box class="indicatorScroll-bar" v-bind="{ h, color }" />
	</div>
</template>

<script setup lang="ts">
import Box from '../layout/Box.vue'

// Props --------------------------------------------------
defineProps({
	h: { type: [Number, String], default: 100 },
	color: { type: String, default: 'dark' },
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.indicatorScroll'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;

		&-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0.1;
		}

		&-bar {
			width: 1px;
			height: 100%;
			background-color: var(--color-dark);

			animation-name: move;
			animation-timing-function: var.$transition-base-timing-function;
			animation-duration: 2.5s;
			animation-iteration-count: infinite;
			animation-direction: normal;
			animation-fill-mode: backwords;

			/*アニメーションの終了後に最初のキーフレームのスタイルを適用する*/
			@keyframes move {
				0% {
					transform: translateY(-100%);
				}

				50% {
					transform: translateY(100%);
				}

				100% {
					transform: translateY(100%);
				}
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

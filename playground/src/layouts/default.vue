<template>
	<div class="layoutDefault">
		<DevHeader v-if="!route.path.includes('login')" v-model:show-menu="showMenu"
			v-resize="(rect: DOMRectReadOnly) => headerHeight = rect.height" class="layoutDefault-menu">
			<template #left>
				<Typography class="layoutDefault-menu-label" footnote bold color="text060">
					@bouzu/ui&nbsp;v{{ version }}
				</Typography>
			</template>
		</DevHeader>
		<Page center :top-space="headerHeight" bottom-space="50">
			<NuxtPage />
		</Page>
	</div>
</template>

<script setup lang="ts">
// Constants ------------------
const version = useRuntimeConfig().public.VERSION

// Stores & Composables ------------------
const route = useRoute()

// Data ------------------
const headerHeight = ref(0)
const showMenu = ref(false)
</script>

<style lang="scss">
@use '../../../src/runtime/scss/_variables.scss' as var;
@use '../../../src/runtime/scss/_mixins.scss' as mix;
$cn: '.layoutDefault'; // コンポーネントクラス名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		z-index: 0;
		width: 100%;
		height: auto;

		&-menu {
			position: fixed;
			top: 0;
			z-index: 10;
			width: 100%;

			&-label {
				/* 影を広げて背景を塗る */
				box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.05);
				padding: 4px 8px;
				margin-left: 4px;
				border-radius: 4px;
				cursor: pointer;
				transition: var.$transition-base;

				&:hover {
					opacity: .6;
				}
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

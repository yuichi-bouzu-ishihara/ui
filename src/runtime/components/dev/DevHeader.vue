<template>
	<Box class="devHeader" color="background080" bg-blur>
		<!-- eslint-disable-next-line no-irregular-whitespace -->
		<Container full no-padding>
			<Container full>
				<SlotHeader>
					<template #left>
						<slot name="left" />
					</template>
					<template #center>
						<Typography body bold>
							<Row class="devHeader-title" gap="8" justify="center" align="center" @click="handleShowMenu">
								{{ currentPageName }}
								<Icon name="arrowDown" size="10" color="text" />
							</Row>
						</Typography>
					</template>
					<template #right>
						<Icon v-if="close" name="cross" size="20" @click="emit('close')" />
					</template>
				</SlotHeader>
			</Container>
			<TransitionFade>
				<Backdrop v-show="showMenu" class="devHeader-overlay" soft @click="showMenu = false" />
			</TransitionFade>
			<TransitionPopover y="-20">
				<!-- <Scroll v-show="showMenu" class="devHeader-menus"> -->
				<div v-show="showMenu" class="devHeader-menus">
					<Column class="devHeader-menus-inner">
						<div class="devHeader-menus-inner-list">
							<DevMenu v-for="(item, index) in menus" :key="`global-${index}`" class="devHeader-menus-inner-list-item"
								v-bind="item" />
						</div>
						<Column class="devHeader-menus-inner-mode" gap="8">
							<slot name="footer" />
						</Column>
					</Column>
				</div>
				<!-- </Scroll> -->
			</TransitionPopover>
		</Container>
	</Box>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSheet } from '../../composables/overlays/sheet'
import Icon from '../elements/Icon.vue'
import Typography from '../elements/Typography.vue'
import Backdrop from '../overlays/Backdrop.vue'
import Box from '../layout/Box.vue'
import Row from '../layout/Row.vue'
import Column from '../layout/Column.vue'
import Container from '../layout/Container.vue'
import SlotHeader from '../navigation/SlotHeader.vue'
import TransitionFade from '../transition/TransitionFade.vue'
import TransitionPopover from '../transition/TransitionPopover.vue'
import DevMenu from './DevMenu.vue'
import type { DevMenu as Menu } from './interfaces'
import SheetDevMenu from '../overlays/SheetDevMenu.vue'

const route = useRoute()

// Models ---------------------
const showMenu = defineModel<boolean>('showMenu', { required: false })

// Props ---------------------------------------------------------
defineProps({
	close: { type: Boolean, default: false }, // 閉じるボタンの表示
})

// Emits ---------------------
const emit = defineEmits<{
	close: []
	darkmode: [boolean]
	sizeAuto: [boolean]
}>()

// Data ----------------------
const currentPageName = ref('/')
const menus = ref<Menu[]>([])

const handleShowMenu = () => {
	useSheet().open({ component: SheetDevMenu as unknown as Component })
}

// Watch --------------------
watch(
	() => route.path,
	(nv) => {
		if (nv === '/') {
			currentPageName.value = 'Menu'
		}
		else {
			currentPageName.value = nv as string
		}
	},
	{ immediate: true },
)
// ページ遷移したらメニューを閉じる
watch(
	() => route.path,
	() => {
		showMenu.value = false
	},
	{ immediate: true },
)
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_functions.scss' as func;
@use '../../scss/_mixins.scss' as mix;
$cn: '.devHeader'; // コンポーネントクラス名

$height: 56;

$padding-left: 16;
$padding-right: 16;

$menu-top-space: 12;
$menu-bottom-space: 12;
$menu-max-width: 480;

$menu-padding-top: 6;
$menu-padding-bottom: 6;
$menu-padding-h: $padding-left;

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		z-index: 0;
		width: 100%;
		overflow: visible;

		&-title {
			cursor: pointer;

			&:hover {
				opacity: 0.6;
			}
		}

		&-close {
			position: absolute;
			top: 0;
			right: func.get-size($padding-right);
			bottom: 0;
			margin: auto;
			z-index: 1;
		}

		&-overlay {
			position: absolute;
			z-index: 0 !important;
			top: 0;
			left: 0;
			right: 0;
			height: 100vh;
		}

		&-menus {
			position: absolute;
			z-index: 10;
			top: func.get-size($height + $menu-top-space);
			left: func.get-size($menu-padding-h);
			right: func.get-size($menu-padding-h);
			max-width: func.get-size($menu-max-width);
			width: calc(100vw - #{func.get-size($menu-padding-h * 2)});
			height: calc(100vh - #{func.get-size($height + $menu-top-space + $menu-bottom-space)});
			padding-top: func.get-size($menu-padding-top);
			padding-bottom: func.get-size($menu-padding-bottom);
			margin: auto;
			background-color: var(--color-light);

			&-inner {
				min-height: 100%;

				&-list {
					flex-grow: 1;
					width: 100%;

					&-item {
						width: 100%;
					}
				}

				&-mode {
					position: sticky;
					bottom: func.get-size(-$menu-padding-bottom);
					width: 100%;
					background-color: var(--color-light);
					padding-top: func.get-size(12);
					padding-bottom: func.get-size(12);
					padding-left: func.get-size(16);
					padding-right: func.get-size(16);
					border-top: solid var(--color-dark-020) 0.5px;
				}
			}
		}
	}

	@if $mode =='darkmode' {
		background-color: var(--color-darkblack);

		&-menus {
			background-color: var(--color-dark);

			&-inner {
				&-mode {
					background-color: var(--color-dark);
					border-top-color: var(--color-light-020);
				}
			}
		}
	}

	@if $mode =='auto' {
		min-height: func.get-size($height, false);
		height: func.get-size($height, false);
		padding-left: func.get-size($padding-left, false);
		padding-right: func.get-size($padding-right, false);

		&-close {
			right: func.get-size($padding-right, false);
		}

		&-menus {
			top: func.get-size($height + $menu-top-space, false);
			left: func.get-size($menu-padding-h, false);
			right: func.get-size($menu-padding-h, false);
			max-width: func.get-size($menu-max-width);
			width: calc(100vw - #{func.get-size($menu-padding-h * 2, false)});
			height: calc(100vh - #{func.get-size($height + $menu-top-space + $menu-bottom-space, false)});
			padding-top: func.get-size($menu-padding-top, false);
			padding-bottom: func.get-size($menu-padding-bottom, false);

			&-inner {
				&-mode {
					bottom: func.get-size(-$menu-padding-bottom, false);
					padding-top: func.get-size(12, false);
					padding-bottom: func.get-size(12, false);
					padding-left: func.get-size(16, false);
					padding-right: func.get-size(16, false);
				}
			}
		}
	}
}
</style>

<template>
	<div class="devMenu">
		<Row v-if="!page" class="devMenu-header" justify="between" align="center" gap="8" @click="toggleOpen">
			<Typography class="devMenu-header-txt" body bold unselectable color="text" lineclamp="1">
				{{ name }}
			</Typography>
			<Icon v-if="hasChildren" class="devMenu-header-icon" :name="isOpen ? 'arrowUp' : 'arrowDown'" size="12"
				color="text" />
		</Row>
		<BasicLink v-else class="devMenu-children-item" active-class="_current" no-hover-style :to="{ name: page }">
			<Typography body bold unselectable color="text" lineclamp="1">
				{{ name }}
			</Typography>
		</BasicLink>
		<Box :h="childrenHeight">
			<TransitionAcordion>
				<Box v-if="hasChildren" v-show="isOpen" v-resize="(rect: DOMRectReadOnly) => childrenHeight = rect.height"
					class="devMenu-children">
					<template v-for="(child, i) in children" :key="`devMenu-children-item-${i}`">
						<DevMenu v-if="!(child as Menu).page" v-bind="child" />
						<BasicLink v-else class="devMenu-children-item" active-class="_current" no-hover-style
							:to="{ name: (child as Menu).page }">
							<!-- 型アサーションを使用 -->
							<Typography caption1 bold unselectable color="text" lineclamp="1">
								{{ (child as Menu).name }} <!-- 型アサーションを使用 -->
							</Typography>
						</BasicLink>
					</template>
				</Box>
			</TransitionAcordion>
		</Box>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Typography from '../elements/Typography.vue'
import TransitionAcordion from '../transition/TransitionAcordion.vue'
import BasicLink from '../elements/BasicLink.vue'
import Box from '../layout/Box.vue'
import Row from '../layout/Row.vue'
import Icon from '../elements/Icon.vue'
import type { DevMenu as Menu } from './interfaces'

// Props ---------------------------------------------------------
const props = defineProps({
	name: { type: String, default: '' },
	open: { type: Boolean, default: false },
	children: { type: Array as () => Menu[], default: () => [] },
	page: { type: String, default: '' },
})

// Data ----------------------------------------------------------
const isOpen = ref(props.open)
const childrenHeight = ref(0)

const hasChildren = computed(() => props.children.length > 0)

// Methods -------------------------------------------------------
const toggleOpen = () => {
	if (hasChildren.value) {
		isOpen.value = !isOpen.value
	}
}
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_functions.scss' as func;
@use '../../scss/_mixins.scss' as mix;

$cn: '.devMenu'; // コンポーネントクラス名

$side-space: 16;
$item-height: 44;

@include mix.component-styles($cn) using ($mode) {

	@if $mode =='base' {
		padding-left: func.get-size($side-space, true);
		padding-right: func.get-size($side-space, true);

		& & {
			margin-left: func.get-size(-$side-space, true);
			margin-right: func.get-size(-$side-space, true);
		}

		&-header {
			height: func.get-size($item-height, true);
			cursor: pointer;
			transition: var.$transition-base;
			opacity: .6;

			&:hover {
				opacity: 1;
			}

			&._current {
				opacity: 1;
			}
		}

		&-children {
			padding-left: func.get-size($side-space, true);

			&-item {
				display: flex;
				align-items: center;
				height: func.get-size($item-height, true);
				transition: var.$transition-base;
				opacity: .6;

				&:hover {
					opacity: 1;
				}

				&._current {
					opacity: 1;
				}
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {
		padding-left: func.get-size($side-space, false);
		padding-right: func.get-size($side-space, false);

		& & {
			margin-left: func.get-size(-$side-space, false);
			margin-right: func.get-size(-$side-space, false);
		}

		&-header {
			height: func.get-size($item-height, false);
		}

		&-children {
			padding-left: func.get-size($side-space, false);

			&-item {
				height: func.get-size($item-height, false);
			}
		}
	}
}
</style>

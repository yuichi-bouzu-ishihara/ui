<template>
	<div class="treeMenu" :class="{ _active: active || isExpanded }" :role="isRoot ? 'tree' : undefined">
		<Row justify="between" align="center" nowrap v-bind="{ gap: config.gap }" @mouseenter="isHover = true"
			@mouseleave="isHover = false">
			<Row align="center" :gap="config.gap" nowrap>
				<Clickable v-if="icon && hasChildren" class="treeMenu-toggle" @click="toggleExpanded"
					role="button" :aria-label="isExpanded ? 'collapse' : 'expand'">
					<Box :w="config.iconSize" :h="config.iconSize">
						<Column justify="center" align="center" fit>
							<Icon v-bind="getToggleIcon" class="treeMenu-toggle-icon"
								:class="{ _expanded: isExpanded, _hover: isHover }" />
						</Column>
					</Box>
				</Clickable>
				<Box v-else-if="icon" :w="config.iconSize" :h="config.iconSize">
					<Column justify="center" align="center" fit>
						<Icon :name="icon" :size="config.iconSize" :color="current ? 'light' : 'light-060'" />
					</Column>
				</Box>
				<Clickable class="treeMenu-header" :class="{ _current: current }" @click="handleClick"
					role="treeitem" :aria-expanded="hasChildren ? isExpanded : undefined" :aria-selected="current">
					<Row align="center" gap="4" nowrap>
						<Typography :font-size="config.fontSize" color="light" cap-height-baseline unselectable lineclamp="1">
							{{ label }}
						</Typography>
						<Box v-if="hasChildren && showCount" min-w="12" h="12" color="light" pr="3" pl="2" r="3" mt="1">
							<Center>
								<Typography font-size="10" bold color="dark" cap-height-baseline>
									{{ children.length }}
								</Typography>
							</Center>
						</Box>
					</Row>
				</Clickable>
			</Row>
			<Row v-if="isHover && ui.length > 0" align="center" gap="10" nowrap>
				<IconUI v-for="(uiItem, index) in ui" :key="`ui-item-${index}`" :to="uiItem.to" :icon="uiItem.icon"
					@click="uiItem.click" />
			</Row>
		</Row>
		<TransitionAcordion>
			<Box v-if="hasChildren && isExpanded" role="group">
				<Box h="12" />
				<Box class="treeMenu-content" :pl="config.gap + config.iconSize" relative
					:style="{ '--tree-menu-line-color': `var(--${config.lineColor})` }">
					<TreeMenu v-for="(item, index) in children" :key="`treeMenu-child-${index}`"
						v-bind="item" :show-count="showCount" :is-root="false" />
				</Box>
			</Box>
		</TransitionAcordion>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { TreeMenuItem, TreeMenuUI, TreeMenuConfig } from '../../types/tree-menu'
import Icon from '../elements/Icon.vue'
import Box from '../layout/Box.vue'
import Column from '../layout/Column.vue'
import Row from '../layout/Row.vue'
import Clickable from '../elements/Clickable.vue'
import TransitionAcordion from '../transition/TransitionAcordion.vue'
import Typography from '../elements/Typography.vue'
import Center from '../layout/Center.vue'
import IconUI from './IconUI.vue'
import { useAppConfig } from '#imports'

// Re-export types for backward compatibility
export type { TreeMenuItem, TreeMenuUI }
/** @deprecated Use TreeMenuItem instead */
export type ChildMenu = TreeMenuItem
/** @deprecated Use TreeMenuUI instead */
export type ChildMenuUI = TreeMenuUI

// Config ------------------------------------------------------------
const defaultConfig: TreeMenuConfig = {
	gap: 8,
	iconSize: 20,
	toggleIconName: 'arrowDown',
	toggleIconSize: 12,
	indentSize: 28,
	lineColor: 'color-light-020',
	fontSize: '14',
}
const config = computed(() => {
	const appConfig = useAppConfig()?.ui as { treeMenu?: Partial<TreeMenuConfig> } | undefined
	return { ...defaultConfig, ...appConfig?.treeMenu }
})

// Props ------------------------------------------------------------
const props = defineProps({
	label: { type: String, default: '' },
	icon: { type: String, default: '' },
	to: { type: String, default: '' },
	click: { type: Function as PropType<() => void>, default: undefined },
	ui: { type: Array as PropType<TreeMenuUI[]>, default: () => [] },
	children: { type: Array as PropType<TreeMenuItem[]>, default: () => [] },
	showCount: { type: Boolean, default: false },
	expanded: { type: Boolean, default: false },
	isRoot: { type: Boolean, default: true },
})

// Data ------------------------------------------------------------
const isHover = ref(false)
const isExpanded = ref(props.expanded)

// Computed ------------------------------------------------------------
const hasChildren = computed(() => props.children && props.children.length > 0)

const active = computed(() => {
	if (!props.to) return false
	const path = useRoute().path
	// 完全一致、または子パスの場合にアクティブ
	return path === props.to || path.startsWith(props.to + '/')
})

const current = computed(() => {
	return props.to !== '' && props.to === useRoute().path
})

const getToggleIcon = computed(() => {
	const icon = {
		name: props.icon,
		size: config.value.iconSize,
		color: current.value ? 'light' : 'light-060',
	}
	if (hasChildren.value && isHover.value) {
		icon.name = config.value.toggleIconName
		icon.size = config.value.toggleIconSize
		icon.color = 'light'
	}
	return icon
})

// Methods ------------------------------------------------------------
const handleClick = () => {
	// カスタムクリックハンドラが優先
	if (props.click) {
		props.click()
		return
	}

	// ページ遷移（toがある場合）
	if (props.to) {
		useRouter().push(props.to)
		return
	}

	// どちらもない場合、子要素があればトグル
	if (hasChildren.value) {
		isExpanded.value = !isExpanded.value
	}
}

const toggleExpanded = () => {
	if (hasChildren.value) {
		isExpanded.value = !isExpanded.value
	}
}
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;

$cn: '.treeMenu';

#{$cn} {
	&-header {
		opacity: 0.6;
	}

	&._active #{$cn}-header,
	#{$cn}-header._current {
		opacity: 1;
	}

	&-toggle {
		&-icon {
			transition: transform var.$transition-base;

			&._expanded {
				transform: rotate(0deg);
			}

			&:not(._expanded) {
				transform: rotate(-90deg);
			}

			&:not(._hover) {
				transform: none;
			}
		}
	}

	&-content {
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 8px;
			width: 2px;
			height: 100%;
			background-color: var(--tree-menu-line-color, var(--color-light-020));
			border-radius: 100px;
		}
	}
}
</style>

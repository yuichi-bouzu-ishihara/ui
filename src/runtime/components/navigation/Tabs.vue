<template>
	<Box v-resize="(r: DOMRectReadOnly) => rect = r" class="tabs">
		<Row ref="tabsListRef" class="tabs-list" justify="center" align="start" nowrap fit-h>
			<component :is="tab.path ? BasicLink : 'div'" v-for="(tab, index) in list" :key="`tabs-list-item-${index}`"
				class="tabs-list-item" :class="itemClasses(index)" :style="itemWidth" :to="tab.path" replace no-hover-style
				@click="tab.click && tab.click()">
				<Row justify="center" align="start" gap="8" fit-h>
					<template v-if="tab.icon">
						<Icon :name="tab.icon.name" :size="tab.icon.size || 16" />
					</template>
					<template v-else-if="tab.name">
						<Typography v-bind="typography" bold center unselectable cap-height-baseline lineclamp="1">
							{{ tab.name }}
						</Typography>
					</template>
				</Row>
			</component>
		</Row>
		<template v-if="activeIndex !== -1">
			<div v-if="rect && itemRectList[activeIndex]" class="tabs-bar"
				:style="`transform: translateX(${itemRectList[activeIndex].left - rect.left}px); width: ${itemRectList[activeIndex].width}px`" />
		</template>
	</Box>
</template>

<script setup lang="ts">
import { computed, toRefs, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useTabs } from '../../composables/navigation/tabs'
import Icon from '../elements/Icon.vue'
import Typography from '../elements/Typography.vue'
import BasicLink from '../elements/BasicLink.vue'
import Row from '../layout/Row.vue'

// Type ----------------------
type Icon = {
	name: string // アイコン名
	size?: number // アイコンサイズ
}
export type TabsItem = {
	name?: string // 表示名
	click?: () => void // クリックイベント
	path?: string // パス
	icon?: Icon // アイコン
	current?: boolean // 現在選択されているか
}

// Composables ------------------------------------------------------------
const route = useRoute()

// Props --------------
const props = defineProps({
	list: { type: Array as () => TabsItem[], default: () => [] },
	itemWidthAuto: { type: Boolean, default: false },
})
const { list } = toRefs(props)

// Data ------------------
const rect = ref<DOMRectReadOnly | null>(null)
const itemRectList = ref<DOMRectReadOnly[]>([])
const tabsListRef = ref<{ $el?: HTMLElement } | null>(null)

// Computed ------------------
const itemWidth = computed(() => {
	return props.itemWidthAuto ? '' : `width: calc(100% / ${list.value.length});`
})
const itemClasses = computed(() => (index: number) => {
	return {
		_icon: list.value[index].icon,
		_current: list.value[index].current ?? (list.value[index].path ? activeIndex.value === index : false),
		_disabled: !list.value[index].click && !list.value[index].path,
		_auto: props.itemWidthAuto,
	}
})
const activeIndex = computed(() => {
	let index = -1
	if (route && route.path) {
		if (list.value.some(item => item.path)) {
			const path = route.path
			index = list.value.findIndex(item => item.path === path)
		}
		else if (index === -1) {
			index = list.value.findIndex(item => item.current)
		}
	}
	return index
})
const typography = computed(() => {
	return { [`${useTabs().typography}`]: true }
})

// Watch ------------------
// itemWidthAutoの場合の初期化と更新処理
const updateItemRects = async () => {
	if (rect.value && tabsListRef.value) {
		await nextTick()
		const element = tabsListRef.value?.$el || tabsListRef.value
		if (element && 'querySelectorAll' in element) {
			const items = (element as HTMLElement).querySelectorAll('.tabs-list-item')
			const newRects: DOMRectReadOnly[] = []
			items.forEach((item: Element) => {
				newRects.push(item.getBoundingClientRect())
			})
			itemRectList.value = newRects
		}
	}
}

watch(() => rect.value, updateItemRects, { immediate: true, deep: true })
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.tabs'; // コンポーネントセレクタ名

$border-height: 0.5; // ボーダーの高さ

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		z-index: 0;
		width: 100%;
		min-height: var(--tabs-height);
		height: var(--tabs-height);

		&::after {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: -1;
			width: 100%;
			height: var(--tabs-bar-background-height);
			background-color: var(--tabs-bar-background-color);
		}

		&-list {
			&-item {
				height: 100%;
				cursor: pointer;
				transition: var.$transition-base;
				opacity: 0.6;

				&._icon {
					padding-bottom: 16px;
				}

				&._current,
				&:hover:not(._disabled) {
					opacity: 1;
				}

				&:active {
					opacity: 1;
					transform: scale(0.96);
				}

				&._disabled {
					cursor: default;
				}

				&._auto {
					width: auto;
					padding-right: 1em;
					padding-left: 1em;
				}
			}
		}

		&-bar {
			position: absolute;
			left: 0;
			bottom: 0;
			height: var(--tabs-bar-height);
			background-color: var(--tabs-bar-color);
			transition: var.$transition-base;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

<template>
	<Box v-resize="(r: DOMRectReadOnly) => rect = r" class="tabs" :class="tabsClasses" :style="styles">
		<Row ref="tabsListRef" class="tabs-list" :class="{ _ready: isCenteredReady }" :gap="itemGap" justify="center"
			align="start" nowrap fit-h :style="listStyle">
			<component :is="isItemLink(tab, index) ? BasicLink : 'div'" v-for="(tab, index) in displayList"
				:key="`tabs-list-item-${index}`" class="tabs-list-item" :class="displayItemClasses(index)" :style="itemWidth"
				:to="isItemLink(tab, index) ? tab.path : undefined" replace no-hover-style @click="handleItemClick(tab, index)">
				<Row justify="center" align="center" gap="6" fit-h>
					<Icon v-if="tab.icon" :name="tab.icon.name" :size="tab.icon.size || 16" color="var(--custom-text-color)" />
					<Typography v-else-if="tab.name" v-bind="typography" color="var(--custom-text-color)" bold center unselectable
						cap-height-baseline nowrap>
						{{ tab.name }}
					</Typography>
					<Box v-if="tab.notice" mr="-8">
						<NoticeIcon v-if="tab.notice" />
					</Box>
				</Row>
			</component>
		</Row>
		<div v-if="displayActiveIndex !== -1 && rect && itemRectList[displayActiveIndex]" class="tabs-bar"
			:style="barStyle" />
	</Box>
</template>

<script setup lang="ts">
import { computed, toRefs, ref, watch, nextTick, type PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabs } from '../../composables/navigation/tabs'
import Icon from '../elements/Icon.vue'
import NoticeIcon from './NoticeIcon.vue'
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
	notice?: boolean // 通知があるか
}

// Composables ------------------------------------------------------------
const route = useRoute()
const router = useRouter()
const tabs = useTabs()

// Props --------------
const props = defineProps({
	list: { type: Array as () => TabsItem[], default: () => [] },
	gap: { type: String, default: 'var(--tabs-gap)' },
	itemWidthAuto: { type: Boolean, default: false },
	centered: { type: Boolean, default: false },
	cloneCount: { type: Number, default: 0 },
	color: { type: Object as PropType<CustomColor>, default: null },
})
const { list } = toRefs(props)

// Data ------------------
const rect = ref<DOMRectReadOnly | null>(null)
const itemRectList = ref<DOMRectReadOnly[]>([])
const tabsListRef = ref<{ $el?: HTMLElement } | null>(null)
const listTranslateX = ref(0)
const isCenteredReady = ref(false) // 初期位置確定後に true → CSS transition を有効化

// Computed ------------------
const styles = computed(() => {
	return {
		'--custom-text-color': props.color?.text ? props.color.text : 'var(--color-text)',
		'--custom-bar-color': props.color?.text ? props.color.text : 'var(--tabs-bar-color)',
	}
})
const tabsClasses = computed(() => {
	return { _centered: isCentered.value }
})
const auto = computed(() => {
	return tabs.itemWidthAuto || props.itemWidthAuto
})
const isCentered = computed(() => {
	return tabs.centered || props.centered
})
const resolvedCloneCount = computed(() => {
	return props.cloneCount > 0 ? props.cloneCount : tabs.cloneCount
})
const itemWidth = computed(() => {
	if (isCentered.value) return ''
	return auto.value ? '' : `width: calc(100% / ${list.value.length});`
})

// センタリング用: 元リストを左右にクローンして拡張したリスト
const displayList = computed(() => {
	if (!isCentered.value) return list.value
	const original = list.value
	if (original.length === 0) return original
	const clones: TabsItem[] = []
	const count = resolvedCloneCount.value
	for (let i = 0; i < count; i++) {
		clones.push(...original)
	}
	return [...clones, ...original, ...clones]
})

// 元リスト内での activeIndex
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

// 表示リスト内での activeIndex（センタリング時は中央セットのインデックス）
const displayActiveIndex = computed(() => {
	if (activeIndex.value === -1) return -1
	if (!isCentered.value) return activeIndex.value
	const offset = list.value.length * resolvedCloneCount.value
	return offset + activeIndex.value
})

const displayItemClasses = computed(() => (index: number) => {
	const originalIndex = isCentered.value
		? index % list.value.length
		: index
	const item = list.value[originalIndex]
	const isActive = isCentered.value
		? originalIndex === activeIndex.value
		: (item?.current ?? (item?.path ? activeIndex.value === index : false))
	return {
		_icon: item?.icon,
		_current: isActive,
		_disabled: !item?.click && !item?.path,
		_auto: auto.value || isCentered.value,
	}
})

const typography = computed(() => {
	return { [`${useTabs().typography}`]: true }
})
const itemGap = computed(() => {
	return (auto.value || isCentered.value) ? props.gap : ''
})
const listStyle = computed(() => {
	if (!isCentered.value) return ''
	return `transform: translateX(${listTranslateX.value}px);`
})
const barStyle = computed(() => {
	const activeRect = itemRectList.value[displayActiveIndex.value]
	if (!activeRect) return ''
	const width = activeRect.width ?? 0
	if (isCentered.value) {
		return `left: 50%; transform: translateX(-50%); width: ${width}px;`
	}
	const left = (activeRect.left ?? 0) - (rect.value?.left ?? 0)
	return `transform: translateX(${left}px); width: ${width}px;`
})

// Methods ------------------
const isItemLink = (tab: TabsItem, displayIndex: number) => {
	if (!tab.path) return false
	if (!isCentered.value) return true
	const originalLength = list.value.length
	const offset = originalLength * resolvedCloneCount.value
	return displayIndex >= offset && displayIndex < offset + originalLength
}

const handleItemClick = (tab: TabsItem, displayIndex: number) => {
	if (!isCentered.value) {
		tab.click && tab.click()
		return
	}
	const originalIndex = displayIndex % list.value.length
	const originalItem = list.value[originalIndex]
	if (originalItem?.click) {
		originalItem.click()
	}
	else if (originalItem?.path) {
		router.replace(originalItem.path)
	}
}

// センタリング: active item の中心がコンテナ中央に来るよう tabs-list を translateX
// offsetLeft はレイアウト位置（transform に影響されない）なので安定して計算可能
const updateCenterPosition = async () => {
	if (!isCentered.value || !rect.value) return
	await nextTick()
	const element = tabsListRef.value?.$el || tabsListRef.value
	if (!element || !('querySelectorAll' in element)) return
	const container = element as HTMLElement
	const items = container.querySelectorAll('.tabs-list-item')
	const targetIndex = displayActiveIndex.value
	if (targetIndex === -1 || !items[targetIndex]) return
	const targetEl = items[targetIndex] as HTMLElement
	const containerWidth = rect.value.width
	const targetCenter = targetEl.offsetLeft + targetEl.offsetWidth / 2
	listTranslateX.value = containerWidth / 2 - targetCenter
}

// Watch ------------------
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

// rect 確定・リサイズ → センタリング再計算 → itemRects 更新
watch(() => rect.value, async () => {
	await updateCenterPosition()
	if (isCentered.value && !isCenteredReady.value) {
		await nextTick()
		isCenteredReady.value = true
	}
	await updateItemRects()
}, { immediate: true, deep: true })

// activeIndex 変更 → センタリング更新 → itemRects 更新
watch(displayActiveIndex, async () => {
	await updateCenterPosition()
	await updateItemRects()
})
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
			background-color: var(--custom-bar-color);
			opacity: 0.2;
		}

		&._centered {
			overflow: hidden;

			#{$cn}-list {
				justify-content: flex-start;
				width: max-content;

				&._ready {
					transition: transform var.$transition-base-duration var.$transition-base-timing-function;
				}
			}
		}

		&-list {
			&-item {
				height: 100%;
				padding-top: var(--tabs-item-padding-top);
				padding-bottom: var(--tabs-item-padding-bottom);
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
					padding-right: var(--tabs-item-padding-side);
					padding-left: var(--tabs-item-padding-side);
				}
			}
		}

		&-bar {
			position: absolute;
			left: 0;
			bottom: 0;
			height: var(--tabs-bar-height);
			background-color: var(--custom-bar-color);
			transition: var.$transition-base;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

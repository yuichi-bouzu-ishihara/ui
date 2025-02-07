<template>
	<div class="tabs">
		<Row class="tabs-list" align="center" nowrap>
			<component :is="tab.path ? BasicLink : 'div'" v-for="(tab, index) in list" :key="`tabs-list-item-${index}`"
				class="tabs-list-item" :class="itemClasses(index)" :style="itemWidth" :to="tab.path" replace no-hover-style
				@click="tab.click && tab.click()">
				<Row justify="center" align="center" gap="8">
					<template v-if="tab.icon">
						<Icon :type="tab.icon.name" :size="tab.icon.size || 16" />
					</template>
					<template v-else-if="tab.name">
						<Typography caption1 bold center unselectable lineclamp="1">
							{{ tab.name }}
						</Typography>
					</template>
				</Row>
			</component>
		</Row>
		<template v-if="activeIndex !== -1">
			<div class="tabs-bar" :style="`${itemWidth}; transform: translateX(${100 * activeIndex}%)`" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useRoute } from 'vue-router'
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
	current: boolean // 現在選択されているか
}

// Props --------------
const props = defineProps({
	list: { type: Array as () => TabsItem[], default: () => [] },
})
const { list } = toRefs(props)

// Computed ------------------
const itemWidth = computed(() => {
	return `width: calc(100% / ${list.value.length});`
})
const itemClasses = computed(() => (index: number) => {
	return {
		_icon: list.value[index].icon,
		_current: list.value[index].current,
		_disabled: !list.value[index].click && !list.value[index].path,
	}
})
const activeIndex = computed(() => {
	let index = -1
	if (list.value.some(item => item.path)) {
		const path = useRoute().path
		index = list.value.findIndex(item => item.path === path)
	}
	else if (index === -1) {
		index = list.value.findIndex(item => item.current)
	}
	return index
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.tabs'; // コンポーネントセレクタ名

$portfolios-gap: 32; // ポートフォリオメニュー同士のスペース
$side-space: 52; // 左右に空けるスペース

// その他メニュー同士のスペース。
// ※ウィンドウ幅によって隙間は縮んで欲しいので、max 設定はしない。
$others-gap: 28;

$active-bar-height: 1.5; // アクティブバーの高さ
$border-height: 0.5; // ボーダーの高さ

$min-height: 24; // 最小の高さ

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		width: 100%;
		min-height: func.get-size($min-height);

		&::after {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: func.get-size($border-height);
			background-color: var(--color-text-020);
		}

		&-list {
			&-item {
				cursor: pointer;
				padding-bottom: func.get-size(10);
				transition: var.$transition-base;
				opacity: 0.6;

				&._icon {
					padding-bottom: func.get-size(16);
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
			}
		}

		&-bar {
			position: absolute;
			left: 0;
			bottom: 0;
			height: func.get-size($active-bar-height);
			background-color: var(--color-text);
			transition: var.$transition-base;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

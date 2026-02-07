<template>
	<div class="sheet-wrapper" :style="{ zIndex: index }">
		<div ref="sheetEl" class="sheet" :class="classes" :style="{ ...variables, ...depthStyle }">
			<div class="sheet-inner">
				<div class="sheet-inner-item">
					<Container no-padding v-bind="container">
						<Box v-resize="(rect: DOMRectReadOnly) => contentHeight = rect.height" class="sheet-inner-item-content"
							w="100%" ml="auto" mr="auto" :color="backgroundColor">
							<template v-if="isHeader">
								<Box ref="headerEl" sticky top="0" w="100%" :z-index="headerZIndex">
									<Container class="sheet-inner-item-content-header" v-bind="container" no-padding>
										<SlotHeader v-bind="{ title, pagenation }" blur :background="backgroundColor" :color="textColor"
											:style="{ padding: `0 ${containerSideSpace}` }">
											<template #left>
												<IconUI v-if="back" :icon="{ name: 'arrowLeft', size: 18, color: textColor }"
													:box="{ w: 36, h: 36 }" @click="emit('back')" />
												<IconUI v-else-if="leftIcon" :icon="{ name: leftIcon, size: 18, color: textColor }"
													:box="{ w: 36, h: 36 }" @click="emit('left-icon-click')" />
												<slot v-else name="header-left" />
											</template>
											<template #right>
												<IconUI v-if="close" :icon="{ name: 'cross', size: 18, color: textColor }"
													:box="{ w: 36, h: 36 }" @click="emit('close')" />
												<IconUI v-else-if="rightIcon" :icon="{ name: rightIcon, size: 18, color: textColor }"
													:box="{ w: 36, h: 36 }" @click="emit('right-icon-click')" />
												<slot v-else name="header-right" />
											</template>
											<template #center>
												<slot name="header-center" />
											</template>
										</SlotHeader>
									</Container>
								</Box>
							</template>
							<Box w="100%" relative z-index="0"
								:h="`calc(100% - var(--header-height) - ${footnoteRect?.height || 0}px)`">
								<Column class="sheet-inner-item-content-main" :align="center ? 'center' : 'start'" justify="stretch"
									fit-w :fit-h="center">
									<Box v-resize="(rect: DOMRectReadOnly) => contentHeight = rect.height">
										<slot />
									</Box>
								</Column>
							</Box>
							<Box v-if="footnote" v-resize="(rect: DOMRectReadOnly) => footnoteRect = rect" p="16" opacity="0.6">
								<Container v-bind="container">
									<Center>
										<Typography footnote center cap-height-baseline :color="textColor">
											{{ footnote }}
										</Typography>
									</Center>
								</Container>
							</Box>
						</Box>
					</Container>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useSlots, watch, type PropType } from 'vue'
import Typography from '../elements/Typography.vue'
import Box from '../layout/Box.vue'
import Center from '../layout/Center.vue'
import Column from '../layout/Column.vue'
import Container from '../layout/Container.vue'
import SlotHeader from '../navigation/SlotHeader.vue'
import IconUI from '../navigation/IconUI.vue'
import type { Props as PagenationProps } from '../navigation/Pagenation.vue'
import { useSheet } from '../../composables/overlays/sheet'
import { useBreakPoint } from '../../composables/break-point'
import { useViewport } from '../../composables/viewport'
import { useHeader } from '../../composables/navigation/header'
import { useContainer } from '../../composables/layout/container'

// Composables -----------------------
const sheet = useSheet()
const { list } = sheet
const slots = useSlots()
const header = useHeader()
const viewport = useViewport()
const { baseAbove } = useBreakPoint()

// Props -----------------------
const props = defineProps({
	index: { type: Number, default: 0 }, // このシートの SheetLayer 内でのインデックス
	name: { type: String, default: '' },
	title: { type: String, default: '' },
	pagenation: { type: Object as PropType<PagenationProps | null>, default: null },
	leftIcon: { type: String, default: '' },
	rightIcon: { type: String, default: '' },
	close: { type: Boolean, default: false }, // 右に閉じるボタンを表示する
	back: { type: Boolean, default: false }, // 左に戻るボタンを表示する
	full: { type: Boolean, default: false }, // 幅を狭くする ※breakpoint base 以上で有効、それ以下は無視される。
	wide: { type: Boolean, default: false }, // 幅を広くする ※breakpoint base 以上で有効、それ以下は無視される。
	narrow: { type: Boolean, default: false }, // 幅を狭くする ※breakpoint base 以上で有効、それ以下は無視される。
	footnote: { type: String, default: '' }, // フッターに表示するテキスト
	center: { type: Boolean, default: false }, // コンテンツを中央に配置する
	color: { type: Object, default: () => ({ background: '', text: '' }) }, // シートの背景色
})

// Emits -----------------------
const emit = defineEmits(['close', 'left-icon-click', 'right-icon-click', 'back'])

// Data -----------------------------------------------
const contentHeight = ref(0)
const isContentOverflow = ref(false)
const headerEl = ref<HTMLElement | null>(null)
const sheetEl = ref<HTMLElement | null>(null)
const headerZIndex = ref(0)
const footnoteRect = ref<DOMRectReadOnly | null>(null)

// Computed -----------------------------------------------
const classes = computed(() => {
	return {
		_scroll: isScroll.value,
		_full: props.full,
		_wide: props.wide,
		_narrow: props.narrow,
		_deep: depth.value !== 0,
	}
})
const depth = computed(() => {
	return list.value.length - (props.index + 1)
})
const backgroundColor = computed(() => {
	let str = ''
	if (props.color.background === '') {
		str = sheet.color.background
	}
	else {
		str = props.color.background
	}
	return str.replace('color-', '').replace('-', '')
})
const textColor = computed(() => {
	let str = ''
	if (props.color.text === '') {
		str = sheet.color.text
	}
	else {
		str = props.color.text
	}
	return str.replace('color-', '').replace('-', '')
})
const isHeader = computed(() => props.title || props.close || props.leftIcon || props.rightIcon || !!slots['header-left'] || !!slots['header-right'] || !!slots['header-center'])
const isScroll = computed(() => /* useSheetsStore().scrollY > 0 */ false)
const container = computed(() => ({
	narrow: baseAbove() ? props.narrow : false,
	full: baseAbove() ? props.full : true,
	wide: baseAbove() ? props.wide : false,
}))
const containerSideSpace = computed(() => {
	if (container.value.narrow) {
		return useContainer().narrow?.sideSpace || 0
	}
	else if (container.value.wide) {
		return useContainer().wide?.sideSpace || 0
	}
	else if (container.value.full) {
		return useContainer().full?.sideSpace || 0
	}
	else {
		return useContainer().base?.sideSpace || 0
	}
})
const variables = computed(() => {
	const obj: Record<string, string> = {}
	if (props.full && !isContentOverflow.value) {
		obj['--sheet-inner-height'] = '100vh'
	}
	else {
		obj['--sheet-inner-height'] = 'auto'
	}
	obj['--sheet-top-space'] = `${topSpace.value}px`
	obj['--sheet-bottom-space'] = `${bottomSpace.value}px`
	return obj
})
// 階層を深く見せるスタイル
const depthStyle = computed(() => {
	let scale = 1
	let brightness = 0
	let translateY = 0
	if (list.value.length > 0) {
		scale = 1 - depth.value * 0.04
		brightness = 1 - depth.value * 0.25
		translateY = depth.value * -10

		return { 'transform': `translateY(${translateY}px) scale(${scale})`, 'transform-origin': 'center top', 'filter': `brightness(${brightness})` }
	}
	else {
		return {}
	}
})
const topSpace = computed(() => {
	return header.config.value ? Number(header.config.value.height.replace('px', '')) / 2 : 0
})
const bottomSpace = computed(() => {
	if (props.full || !baseAbove()) {
		return 0
	}
	else {
		return topSpace.value
	}
})

// Watch -----------------------------------------------
watch(() => [viewport.height.value, contentHeight.value], () => {
	if (contentHeight.value > (viewport.height.value - Number(topSpace.value))) {
		isContentOverflow.value = true
	}
	else {
		isContentOverflow.value = false
	}
}, { immediate: true })

// Scroll -----------------------------------------------
// header が sticky 状態（スクロールコンテナの上端に張り付いている）かどうかを判定し、z-index を動的に切り替える
const onSheetScroll = () => {
	if (!headerEl.value || !sheetEl.value) return
	const headerRect = (headerEl.value as unknown as { $el?: HTMLElement }).$el?.getBoundingClientRect()
	const sheetRect = sheetEl.value.getBoundingClientRect()
	if (!headerRect) return
	// header の top がスクロールコンテナの top とほぼ一致すれば sticky 状態
	headerZIndex.value = Math.abs(headerRect.top - sheetRect.top) < 2 ? 1 : 0
}

// Lifecycle -----------------------------------------------
onMounted(() => {
	sheetEl.value?.addEventListener('scroll', onSheetScroll)
})
onUnmounted(() => {
	sheetEl.value?.removeEventListener('scroll', onSheetScroll)
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.sheet'; // コンポーネントセレクタ名

#{$cn} {
	position: relative;
	width: 100%;
	height: 100%;
	overflow-y: scroll;
	transition: var.$transition-base;

	&-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
	}

	&-inner {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		min-height: 100%;
		height: auto;
		padding-top: var(--sheet-top-space);
		padding-bottom: var(--sheet-bottom-space);
		// padding-bottom: calc(var(--header-height) / 2);
		transform-style: preserve-3d; // 子要素に preserve-3d がある場合に表示がバグる不具合を回避する

		&-item {
			width: 100%;

			&-content {
				padding-bottom: env(safe-area-inset-bottom) !important; // iPhoneX 以降のホームボタンの下の余白
				height: calc(var(--sheet-inner-height) - var(--sheet-top-space));
				border-radius: #{var.$border-radius-xlarge}px;

				&-header {
					border-radius: #{var.$border-radius-xlarge}px #{var.$border-radius-xlarge}px 0 0;
					overflow: hidden;
				}

				&-main {
					border-radius: #{var.$border-radius-xlarge}px !important;
				}

				&-footnote {
					padding-top: 24px;
					padding-bottom: 24px;
					border-radius: 0 0 #{var.$border-radius-xlarge}px #{var.$border-radius-xlarge}px;
				}
			}
		}
	}

	&._deep {
		border-radius: #{var.$border-radius-xlarge}px;
		overflow: hidden;
	}

	@include mix.breakpoint('base') {
		&-inner {
			align-items: center;
		}
	}
}
</style>

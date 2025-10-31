<template>
	<div class="sheet-wrapper" :style="{ zIndex: index }">
		<div class="sheet" :class="classes" :style="{ ...variables, ...depthStyle }">
			<div class="sheet-inner">
				<div class="sheet-inner-item">
					<Container no-padding v-bind="container">
						<Box v-resize="(rect: DOMRectReadOnly) => contentHeight = rect.height" class="sheet-inner-item-content"
							w="100%" ml="auto" mr="auto" :color="backgroundColor">
							<template v-if="isHeader">
								<Box sticky top="0" w="100%" z-index="1">
									<Container no-padding full>
										<SlotHeader class="sheet-inner-item-content-header" v-bind="{ title, pagenation }" blur
											:background="backgroundColor" :color="textColor">
											<template #left>
												<IconMenu v-if="leftIcon" :icon="leftIcon" size="18" :color="textColor"
													@click="emit('left-icon-click')" />
												<slot v-else name="header-left" />
											</template>
											<template #right>
												<IconMenu v-if="close" icon="cross" size="18" :color="textColor" @click="emit('close')" />
												<IconMenu v-else-if="rightIcon" :icon="rightIcon" :color="textColor"
													@click="emit('right-icon-click')" />
												<slot v-else name="header-right" />
											</template>
											<template #center>
												<slot name="header-center" />
											</template>
										</SlotHeader>
									</Container>
								</Box>
							</template>
							<Box w="100%" relative z-index="0" h="calc(100% - var(--header-height))">
								<Column class="sheet-inner-item-content-main" :align="center ? 'center' : 'start'" justify="stretch"
									fit-w :fit-h="center">
									<Box v-resize="(rect: DOMRectReadOnly) => contentHeight = rect.height">
										<slot />
									</Box>
								</Column>
							</Box>
							<template v-if="footnote">
								<div class="sheet-inner-item-content-footnote">
									<Center>
										<Typography caption2 bold center color="text060">
											{{ footnote }}
										</Typography>
									</Center>
								</div>
							</template>
						</Box>
					</Container>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import Typography from '../elements/Typography.vue'
import Box from '../layout/Box.vue'
import Center from '../layout/Center.vue'
import Column from '../layout/Column.vue'
import Container from '../layout/Container.vue'
import SlotHeader from '../navigation/SlotHeader.vue'
import IconMenu from '../navigation/IconMenu.vue'
import type { Props as PagenationProps } from '../navigation/Pagenation.vue'
import { useSheet } from '../../composables/overlays/sheet'
import { useBreakPoint } from '../../composables/break-point'
import { useViewport } from '../../composables/viewport'
import { useHeader } from '../../composables/navigation/header'

// Composables -----------------------
const sheet = useSheet()
const { list } = sheet
const slots = useSlots()
const header = useHeader()

// Props -----------------------
const props = defineProps({
	index: { type: Number, default: 0 }, // このシートの SheetLayer 内でのインデックス
	name: { type: String, default: '' },
	title: { type: String, default: '' },
	pagenation: { type: Object as PropType<PagenationProps | null>, default: null },
	leftIcon: { type: String, default: '' },
	rightIcon: { type: String, default: '' },
	close: { type: Boolean, default: false },
	full: { type: Boolean, default: false }, // 幅を狭くする ※breakpoint base 以上で有効、それ以下は無視される。
	wide: { type: Boolean, default: false }, // 幅を広くする ※breakpoint base 以上で有効、それ以下は無視される。
	narrow: { type: Boolean, default: false }, // 幅を狭くする ※breakpoint base 以上で有効、それ以下は無視される。
	footnote: { type: String, default: '' }, // フッターに表示するテキスト
	center: { type: Boolean, default: false }, // コンテンツを中央に配置する
	color: { type: Object, default: () => ({ background: '', text: '' }) }, // シートの背景色
})

// Emits -----------------------
const emit = defineEmits(['close', 'left-icon-click', 'right-icon-click'])

// Data -----------------------------------------------
const contentHeight = ref(0)
const isContentOverflow = ref(false)

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
	narrow: useBreakPoint().baseAbove() ? props.narrow : false,
	full: useBreakPoint().baseAbove() ? props.full : true,
	wide: useBreakPoint().baseAbove() ? props.wide : false,
}))
const variables = computed(() => {
	const obj: Record<string, string> = {}
	if (props.full && !isContentOverflow.value) {
		obj['--sheet-inner-height'] = '100vh'
	}
	else {
		obj['--sheet-inner-height'] = 'auto'
	}
	obj['--sheet-top-space'] = `${topSpace.value}px`
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

// Watch -----------------------------------------------
watch(() => contentHeight.value, (newVal) => {
	if (newVal > (useViewport().height.value - Number(topSpace.value))) {
		isContentOverflow.value = true
	}
	else {
		isContentOverflow.value = false
	}
}, { immediate: true })
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.sheet'; // コンポーネントセレクタ名

$footnote-padding-vertical: 24;

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
		// padding-bottom: calc(var(--header-height) / 2);
		transform-style: preserve-3d; // 子要素に preserve-3d がある場合に表示がバグる不具合を回避する

		&-item {
			width: 100%;

			&-content {
				padding-bottom: env(safe-area-inset-bottom) !important; // iPhoneX 以降のホームボタンの下の余白
				height: calc(var(--sheet-inner-height) - var(--sheet-top-space));
				border-radius: #{var.$border-radius-xlarge}px;

				&-header {
					padding-left: calc(var(--container-min-side-space) - 4px);
					padding-right: calc(var(--container-min-side-space) - 4px);
					border-radius: #{var.$border-radius-xlarge}px #{var.$border-radius-xlarge}px 0 0;
				}

				&-main {
					border-radius: #{var.$border-radius-xlarge}px !important;
				}

				&-footnote {
					padding: func.get-size($footnote-padding-vertical) var(--container-min-side-space);
					border-radius: 0 0 #{var.$border-radius-xlarge}px #{var.$border-radius-xlarge}px;
				}
			}
		}
	}

	&._full &-inner,
	&._wide &-inner {
		padding-bottom: 0;
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

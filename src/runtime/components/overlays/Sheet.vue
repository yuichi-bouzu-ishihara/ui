<template>
	<div class="sheet-wrapper" :style="{ zIndex: index }">
		<div class="sheet" :class="classes" :style="{ ...variables, ...depthStyle }">
			<div class="sheet-inner">
				<div class="sheet-inner-item">
					<Container no-padding v-bind="container">
						<Box class="sheet-inner-item-content" w="100%" ml="auto" mr="auto" :color="backgroundColor">
							<template v-if="isHeader">
								<Box sticky top="0" w="100%" z-index="1">
									<Container no-padding full>
										<SlotHeader class="sheet-inner-item-content-header" v-bind="{ title }" blur
											:background="backgroundColor" :color="textColor">
											<template v-if="leftIcon" #left>
												<IconMenu :icon="leftIcon" :color="textColor" @click="emit('left-icon-click')" />
											</template>
											<template v-else #left>
												<slot name="header-left" />
											</template>
											<template v-if="close" #right>
												<IconMenu icon="cross" :color="textColor" @click="emit('close')" />
											</template>
											<template v-else-if="rightIcon" #right>
												<IconMenu :icon="rightIcon" :color="textColor" @click="emit('right-icon-click')" />
											</template>
											<template #center>
												<slot name="header-center" />
											</template>
										</SlotHeader>
									</Container>
								</Box>
							</template>
							<Box w="100%" relative z-index="0" :h="contentHeight > 0 ? 'calc(100% - 72px)' : 'auto'">
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
		<slot name="floating" />
	</div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import Typography from '../elements/Typography.vue'
import Box from '../layout/Box.vue'
import Center from '../layout/Center.vue'
import Column from '../layout/Column.vue'
import Container from '../layout/Container.vue'
import SlotHeader from '../navigation/SlotHeader.vue'
import IconMenu from '../navigation/IconMenu.vue'
import { useSheet } from '../../composables/overlays/sheet'
import { useBreakPoint } from '../../composables/break-point'
import { useViewport } from '../../composables/viewport'

// Composables -----------------------
const sheet = useSheet()
const { list } = sheet
const slots = useSlots()

// Props -----------------------
const props = defineProps({
	name: { type: String, default: '' },
	title: { type: String, default: '' },
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
const isHeader = computed(() => props.title || props.close || props.leftIcon || props.rightIcon || !!slots['header-left'] || !!slots['header-center'])
const isScroll = computed(() => /* useSheetsStore().scrollY > 0 */ false)
const container = computed(() => ({
	narrow: useBreakPoint().baseAbove() ? props.narrow : false,
	full: useBreakPoint().baseAbove() ? props.full : true,
	wide: useBreakPoint().baseAbove() ? props.wide : false,
}))
const variables = computed(() => {
	if (props.full && useViewport().height.value > contentHeight.value) {
		return {
			'--sheet-inner-height': '100vh',
		}
	}
	else {
		return {
			'--sheet-inner-height': 'auto',
		}
	}
})
const index = computed(() => {
	return list.value.findIndex(item => item.name === props.name)
})
const depth = computed(() => {
	return list.value.length - (index.value + 1)
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
		padding-top: calc(#{var.$header-height}px / 2);
		// padding-bottom: calc(#{var.$header-height}px / 2);
		transform-style: preserve-3d; // 子要素に preserve-3d がある場合に表示がバグる不具合を回避する

		&-item {
			width: 100%;

			&-content {
				padding-bottom: env(safe-area-inset-bottom) !important; // iPhoneX 以降のホームボタンの下の余白
				height: calc(var(--sheet-inner-height) - #{var.$header-height}px / 2);
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

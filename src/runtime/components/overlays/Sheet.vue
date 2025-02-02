<template>
	<Container class="sheet" :class="classes" no-padding v-bind="container">
		<Box class="sheet-inner" w="100%" ml="auto" mr="auto">
			<template v-if="isHeader">
				<Box sticky top="0" w="100%" z-index="1">
					<Container no-padding full>
						<SlotHeader class="sheet-inner-header" v-bind="{ title }" blur>
							<template v-if="leftIcon" #left>
								<IconMenu :icon="leftIcon" color="text" @click="emit(EMIT_LEFT_ICON_CLICK)" />
							</template>
							<template v-if="close" #right>
								<IconMenu icon="cross" color="text" @click="emit(EMIT_CLOSE)" />
							</template>
						</SlotHeader>
					</Container>
				</Box>
			</template>
			<Box w="100%" relative z-index="0">
				<slot />
			</Box>
			<template v-if="footnote">
				<div class="sheet-inner-footnote">
					<Center>
						<Typography caption2 bold center color="text060">
							{{ footnote }}
						</Typography>
					</Center>
				</div>
			</template>
		</Box>
	</Container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Typography from '../elements/Typography.vue'
import Box from '../layout/Box.vue'
import Center from '../layout/Center.vue'
import Container from '../layout/Container.vue'
import SlotHeader from '../navigation/SlotHeader.vue'
import IconMenu from '../navigation/IconMenu.vue'
import { useMode } from '../../composables/mode'
import { useBreakPoint } from '../../composables/break-point'

// Composables ---------------------------
const { darkmode } = useMode()

// Props -----------------------
const props = defineProps({
	title: { type: String, default: '' },
	leftIcon: { type: String, default: '' },
	close: { type: Boolean, default: false },
	narrow: { type: Boolean, default: false }, // 幅を狭くする ※breakpoint base 以上で有効、それ以下は無視される。
	footnote: { type: String, default: '' }, // フッターに表示するテキスト
})

// Emits -----------------------
const EMIT_CLOSE = 'close'
const EMIT_LEFT_ICON_CLICK = 'left-icon-click'
const emit = defineEmits([EMIT_CLOSE, EMIT_LEFT_ICON_CLICK])

// Computed -----------------------------------------------
const classes = computed(() => {
	return {
		_scroll: isScroll.value,
	}
})
const isHeader = computed(() => props.title || props.close)
const isScroll = computed(() => /* useSheetsStore().scrollY > 0 */ false)
const container = computed(() => ({
	narrow: useBreakPoint().baseAbove() ? props.narrow : false,
	full: useBreakPoint().baseAbove() ? false : true,
}))
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.sheet'; // コンポーネントセレクタ名

$footnote-padding-vertical: 24;

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		&-inner {
			background-color: var(--color-background);
			border-radius: func.get-size(var.$border-radius-xlarge) func.get-size(var.$border-radius-xlarge) 0 0 !important;
			padding-bottom: env(safe-area-inset-bottom) !important; // iPhoneX 以降のホームボタンの下の余白

			&-header {
				padding-left: calc(var(--container-min-side-space) - 4px);
				padding-right: calc(var(--container-min-side-space) - 4px);
				border-radius: func.get-size(var.$border-radius-xlarge) func.get-size(var.$border-radius-xlarge) 0 0;
			}

			&-footnote {
				padding: func.get-size($footnote-padding-vertical) var(--container-min-side-space);
				border-radius: 0 0 func.get-size(var.$border-radius-xlarge) func.get-size(var.$border-radius-xlarge);
			}

		}

		// スクロールしたら、ヘッダー左右の角を四角くする。
		// ヘッダー以下のコンテンツが左右に余白がなく、幅いっぱいだった場合に、
		// スクロールした際に、ヘッダーの左右からコンテンツがはみ出して表示されるのを防ぐため。
		&._scroll {
			#{$cn}-inner-header {
				border-radius: 0;
			}
		}

		@include mix.breakpoint('base') {
			&-inner {
				border-radius: func.get-size(var.$border-radius-xlarge) !important;
			}
		}
	}

	@if $mode =='darkmode' {
		&-inner {
			border-radius: func.get-size(var.$border-radius-xlarge, false) func.get-size(var.$border-radius-xlarge, false) 0 0 !important;
			padding-bottom: env(safe-area-inset-bottom) !important; // iPhoneX 以降のホームボタンの下の余白

			&-header {
				padding-left: calc(var(--container-min-side-space) - 4px);
				padding-right: calc(var(--container-min-side-space) - 4px);
				border-radius: func.get-size(var.$border-radius-xlarge, false) func.get-size(var.$border-radius-xlarge, false) 0 0;
			}

			&-footnote {
				padding: func.get-size($footnote-padding-vertical, false) var(--container-min-side-space);
				border-radius: 0 0 func.get-size(var.$border-radius-xlarge, false) func.get-size(var.$border-radius-xlarge, false);
			}
		}

		// スクロールしたら、ヘッダー左右の角を四角くする。
		// ヘッダー以下のコンテンツが左右に余白がなく、幅いっぱいだった場合に、
		// スクロールした際に、ヘッダーの左右からコンテンツがはみ出して表示されるのを防ぐため。
		&._scroll {
			#{$cn}-header {
				border-radius: 0;
			}
		}
	}

	@if $mode =='auto' {}
}
</style>

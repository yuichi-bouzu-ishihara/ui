<!--
	Button
	ボタンUIコンポーネント
-->
<template>
	<Box ref="element" class="button" :class="[classes, $attrs.class]" :style="customColorStyle"
		v-bind="{ w, h, minW: w, minH: h, r }">
		<template v-if="to">
			<BasicLink class="button-inner" v-bind="{ to, replace, noHoverStyle: true, blank }">
				<Typography class="button-inner-slot" v-bind="typography">
					<slot />
				</Typography>
				<Box v-if="loading || loadingState !== ''" :w="rect?.height" :h="rect?.height" class="button-inner-loader"
					@click.stop="click">
					<Spinner v-bind="spinner" :complete="loadingState === 'completed'" />
				</Box>
			</BasicLink>
		</template>
		<template v-else>
			<button class="button-inner" :type="buttonType" @click="click">
				<Typography class="button-inner-slot" v-bind="typography">
					<slot />
				</Typography>
				<Box v-if="loading || loadingState !== ''" :w="rect?.height" :h="rect?.height" class="button-inner-loader"
					@click.stop="click">
					<Spinner v-bind="spinner" :complete="loadingState === 'completed'" />
				</Box>
			</button>
		</template>
	</Box>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useButton } from '../../composables/elements/button'
import Spinner from '../elements/Spinner.vue'
import Box from '../layout/Box.vue'
import BasicLink from './BasicLink.vue'
import Typography from './Typography.vue'

// Composables ---------------------------
const { config } = useButton()

// Props ---------------------------
const props = defineProps({
	// 優先度
	primary: { type: Boolean, default: false },
	secondary: { type: Boolean, default: false },
	tertiary: { type: Boolean, default: false },
	quaternary: { type: Boolean, default: false },
	info: { type: Boolean, default: false },
	light: { type: Boolean, default: false },
	dark: { type: Boolean, default: false },
	link: { type: Boolean, default: false },
	minimal: { type: Boolean, default: false },

	// サイズ
	large: { type: Boolean, default: false },
	medium: { type: Boolean, default: false },
	small: { type: Boolean, default: false },
	xsmall: { type: Boolean, default: false },

	// 角丸
	rounded: { type: Boolean, default: false },

	// 非アクティブ
	disabled: { type: Boolean, default: false },

	// ローダー表示
	loading: { type: Boolean, default: false },

	// ローダー表示の状態
	loadingState: { type: String, default: '', validator: (value: string) => ['', 'processing', 'completed'].includes(value) },

	// 遷移先 url path。 click を emit する代わりに、<BasicLink to /> する。
	to: { type: [String, Object], default: '' },
	blank: { type: Boolean, default: false }, // 遷移先のページを開く方法を指定する。
	replace: { type: Boolean, default: false },

	// ボタンタイプ
	type: { type: String, default: '' },

	w: { type: [String, Number], default: '' }, // 横幅 ※指定すると padding-left, padding-right : 0 になる。
	h: { type: [String, Number], default: '' }, // 縦幅 ※指定すると padding-top, padding-bottom : 0 になる。

	noPadding: { type: Boolean, default: false },

	color: { type: Object, default: () => ({ background: '', text: '' }) }, // ボタンの色を直接指定
	r: { type: [String, Number], default: '' }, // 角丸の大きさを直接指定
})

// Emits ---------------------------
const emit = defineEmits(['click', 'disabled-click', 'loading-click'])

// Data ---------------------------
const element = ref<InstanceType<typeof Box> | null>(null)
const rect = ref<DOMRect | null>(null)

// Computed ---------------------------
const classes: object = computed(() => {
	const obj: Record<string, boolean> = {
		_disabled: props.disabled,
		_loading: props.loading || props.loadingState !== '',
		_rounded: props.rounded,
		_noPaddingH: props.w !== '' || props.noPadding,
		_noPaddingV: props.h !== '' || props.noPadding,
	}
	obj[`_${priority.value}`] = true
	obj[`_${size.value}`] = true
	return obj
})
const priority = computed(() => {
	if (props.primary) return 'primary'
	if (props.secondary) return 'secondary'
	if (props.tertiary) return 'tertiary'
	if (props.quaternary) return 'quaternary'
	if (props.info) return 'info'
	if (props.light) return 'light'
	if (props.dark) return 'dark'
	if (props.link) return 'link'
	if (props.minimal) return 'minimal'
	return 'primary' // デフォルトの優先度
})
const size = computed(() => {
	if (props.large) return 'large'
	if (props.medium) return 'medium'
	if (props.small) return 'small'
	if (props.xsmall) return 'xsmall'
	return 'medium' // デフォルトのサイズ
})
const tag = computed(() => {
	return props.to ? 'BasicLink' : 'button'
})
const buttonType = computed(() => {
	let str: 'button' | 'reset' | 'submit' | undefined = undefined
	if (tag.value === 'button' && props.type) {
		str = props.type as 'button' | 'reset' | 'submit'
	}
	return str
})
const typography = computed(() => {
	let color = 'text'
	let gradation = ''

	// カスタム色が指定されている場合は、それを使用
	if (props.color && props.color.text) {
		color = props.color.text
	}
	else if (config.value && config.value[priority.value] && config.value[priority.value].textColor) {
		if (config.value[priority.value].textColor.includes('gradation')) {
			color = ''
			gradation = config.value[priority.value].textColor.replace('gradation-', '')
		}
		else {
			color = config.value[priority.value].textColor.replace('color-', '').replace('-', '')
		}
	}

	let fontSize = '13px'
	if (config.value && config.value[size.value] && config.value[size.value].textSize) {
		fontSize = config.value[size.value].textSize
	}

	return {
		fontSize,
		color,
		gradation,
		bold: true,
		unselectable: true,
		nowrap: true,
	}
})
const spinner = computed(() => {
	let color = 'text'
	// カスタム色が指定されている場合は、それを使用
	if (props.color && props.color.text) {
		color = props.color.text
	}
	else if (config.value && config.value[priority.value] && config.value[priority.value].textColor) {
		if (config.value[priority.value].textColor.includes('gradation')) {
			color = 'primary'
		}
		else {
			color = config.value[priority.value].textColor.replace('color-', '').replace('-', '')
		}
	}
	return {
		size: '44%',
		color,
	}
})

// color プロパティによる直接指定のスタイル
const customColorStyle = computed(() => {
	if (!props.color || (!props.color.background && !props.color.text)) {
		return {}
	}

	const style: Record<string, string> = {}

	if (props.color.background) {
		style['--custom-background-color'] = props.color.background
	}

	if (props.color.text) {
		style['--custom-text-color'] = props.color.text
	}

	return style
})

// Methods ---------------------------
const click = () => {
	// to が設定されている場合は、click イベントを emit しない。
	if (props.to) return

	// クリッカブル判定
	const clickable = !props.disabled && (!props.loading || props.loadingState === '')
	// disabled や loading の場合は、それぞれのクリックイベントを emit する。
	if (props.disabled) {
		emit('disabled-click')
	}
	if (props.loading || props.loadingState !== '') {
		emit('loading-click')
	}
	// クリッカブルな場合は、click イベントを emit する。
	if (clickable) {
		emit('click')
	}
}

// Lifecycle ---------------------------
onMounted(async () => {
	await nextTick()
	if (element.value?.$el) {
		rect.value = (element.value.$el as HTMLElement).getBoundingClientRect()
	}
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;

$cn: '.button'; // コンポーネントセレクタ名

// 変数
$btn-slot-gap: 0.5em; // ボタン内の要素間隔

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		z-index: 0;
		display: block;
		max-width: 100%;
		height: var(--button-medium-height);
		background-color: var(--color-dark);
		border-radius: var(--button-medium-radius);
		padding: 0;
		pointer-events: none;
		cursor: pointer;
		transition: all var.$transition-fast-duration var.$transition-base-timing-function;

		// hoverスタイル
		&:hover:not(._disabled) {
			opacity: 0.84;
		}

		// マウスでクリックされている間のスタイル
		&:active:not(._disabled) {
			opacity: 0.64;
			transform: scale(0.96);
		}

		// サイズ別スタイル設定 -----------------------
		// xsmall
		&._xsmall {
			height: var(--button-xsmall-height);
			border-radius: var(--button-xsmall-radius);

			#{$cn}-inner-slot {
				padding: 0 var(--button-xsmall-padding-h);
				margin-top: var(--button-xsmall-text-adjust-top);
			}
		}

		&._small {
			height: var(--button-small-height);
			border-radius: var(--button-small-radius);

			#{$cn}-inner-slot {
				padding: 0 var(--button-small-padding-h);
				margin-top: var(--button-small-text-adjust-top);
			}
		}

		// Large
		&._large {
			height: var(--button-large-height);
			border-radius: var(--button-large-radius);

			#{$cn}-inner-slot {
				padding: 0 var(--button-large-padding-h);
				margin-top: var(--button-large-text-adjust-top);
			}
		}

		// priority別のスタイル -----------------------
		// primary
		&._primary {
			background-image: var(--button-primary-background-color);
			background-color: var(--button-primary-background-color);
			// backdrop-filter: blur(var(--button-primary-background-blur));

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				display: block;
				border: var(--button-primary-border-width) solid var(--button-primary-border-color);
				border-radius: inherit;
				transition: all var.$transition-fast-duration var.$transition-base-timing-function;
			}
		}

		// secondary
		&._secondary {
			background-image: var(--button-secondary-background-color);
			background-color: var(--button-secondary-background-color);
			// backdrop-filter: blur(var(--button-secondary-background-blur));

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				display: block;
				border: var(--button-secondary-border-width) solid var(--button-secondary-border-color);
				border-radius: inherit;
				transition: all var.$transition-fast-duration var.$transition-base-timing-function;
			}
		}

		// tertiary
		&._tertiary {
			background-image: var(--button-tertiary-background-color);
			background-color: var(--button-tertiary-background-color);
			// backdrop-filter: blur(var(--button-tertiary-background-blur));

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				display: block;
				border: var(--button-tertiary-border-width) solid var(--button-tertiary-border-color);
				border-radius: inherit;
				transition: all var.$transition-fast-duration var.$transition-base-timing-function;
			}
		}

		// quaternary
		&._quaternary {
			background-image: var(--button-quaternary-background-color);
			background-color: var(--button-quaternary-background-color);
			// backdrop-filter: blur(var(--button-quaternary-background-blur));

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				display: block;
				border: var(--button-quaternary-border-width) solid var(--button-quaternary-border-color);
				border-radius: inherit;
				transition: all var.$transition-fast-duration var.$transition-base-timing-function;
			}
		}

		// light
		&._light {
			background-image: var(--button-light-background-color);
			background-color: var(--button-light-background-color);
			// backdrop-filter: blur(var(--button-light-background-blur));

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				display: block;
				border: var(--button-light-border-width) solid var(--button-light-border-color);
				border-radius: inherit;
				transition: all var.$transition-fast-duration var.$transition-base-timing-function;
			}
		}

		// dark
		&._dark {
			background-image: var(--button-dark-background-color);
			background-color: var(--button-dark-background-color);
			// backdrop-filter: blur(var(--button-dark-background-blur));

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				display: block;
				border: var(--button-light-border-width) solid var(--button-light-border-color);
				border-radius: inherit;
				transition: all var.$transition-fast-duration var.$transition-base-timing-function;
			}
		}

		// info
		&._info {
			background-image: var(--button-info-background-color);
			background-color: var(--button-info-background-color);
			// backdrop-filter: blur(var(--button-info-background-blur));

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				display: block;
				border: var(--button-info-border-width) solid var(--button-info-border-color);
				border-radius: inherit;
				transition: all var.$transition-fast-duration var.$transition-base-timing-function;
			}
		}

		// link
		&._link {
			background-image: var(--button-link-background-color);
			background-color: var(--button-link-background-color);
			// backdrop-filter: blur(var(--button-link-background-blur));

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				display: block;
				border: var(--button-link-border-width) solid var(--button-link-border-color);
				border-radius: inherit;
				transition: all var.$transition-fast-duration var.$transition-base-timing-function;
			}
		}

		// minimal
		&._minimal {
			background-image: var(--button-minimal-background-color);
			background-color: var(--button-minimal-background-color);
			// backdrop-filter: blur(var(--button-minimal-background-blur));

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				display: block;
			}
		}

		// カスタム色の適用
		&[style*="--custom-background-color"] {
			background-color: var(--custom-background-color) !important;
			background-image: none !important;
		}

		&[style*="--custom-text-color"] &-inner-slot {
			color: var(--custom-text-color) !important;
		}

		// rounded のスタイル
		&._rounded {
			border-radius: 1000px;
		}

		// disabled のスタイル
		&._disabled {
			cursor: default;
			opacity: 0.3;
		}

		// loading 時の -slot スタイル
		&._loading &-inner-slot {
			opacity: 0;
		}

		&._loading {
			cursor: wait;
			opacity: 0.65;
		}

		&._noPaddingH {
			#{$cn}-inner-slot {
				padding-left: 0;
				padding-right: 0;
			}
		}

		&._noPaddingV {
			#{$cn}-inner-slot {
				padding-top: 0;
				padding-bottom: 0;
			}
		}

		&-inner {
			// button スタイルの初期化 - start -------
			-webkit-tap-highlight-color: transparent; // タップ時のハイライトを消す
			appearance: none;
			border: none;
			outline: none;
			background: none;
			// button スタイルの初期化 - end -------

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			padding: 0;
			cursor: inherit;
			pointer-events: auto;

			&::before {
				content: '';
				display: block;
				width: 100%;
				height: 0;
			}

			&-slot {
				// font - start -----
				text-decoration: none;
				// font - end -----

				display: inline-flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				gap: $btn-slot-gap;
				width: 100%;
				height: 100%;
				padding: 0 var(--button-medium-padding-h);
				margin-top: var(--button-medium-text-adjust-top);
				pointer-events: none;
				transition: all var.$transition-fast-duration var.$transition-base-timing-function;

				&:hover:not(._disabled),
				&:focus:not(.focus-visible),
				&:active:not(._disabled) {
					outline: none;
				}
			}

			// loading 中に表示される要素のスタイル
			&-loader {
				position: absolute;
				inset: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: auto;
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

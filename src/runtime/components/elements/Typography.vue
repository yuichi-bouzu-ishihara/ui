<!--
	Typography
	文字を表現するコンポーネント
-->
<template>
	<component :is="tag" :class="classes" :style="styles">
		<slot />
	</component>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useCss } from '../../composables/css'
import { useNumber } from '../../composables/number'
import { useRegex } from '../../composables/regex'

// Stores & Composables --------------------------------
const { getSize } = useCss()
const { isPureNumber } = useNumber()
const { isCssColor } = useRegex()

// Props --------------------------------
const props = defineProps({
	tag: { type: String, default: 'div' },
	color: { type: String, default: 'text' }, // モジュールに設定されたカラー、または、#hex、rgb(r,g,b)、rgba(r,g,b,a) のカラー
	gradation: { type: String, default: '' }, // グラデーションの設定

	bold: { type: Boolean, default: false }, // 太字強制
	extrabold: { type: Boolean, default: false }, // 極太字強制
	normal: { type: Boolean, default: false }, // 通常ウェイト強制
	inline: { type: Boolean, default: false }, // display:inline にする
	linebreak: { type: Boolean, default: false }, // 改行を許可するフラグ
	unselectable: { type: Boolean, default: false }, // 選択不可フラグ
	lineclamp: { type: [String, Number], default: 0 }, // 省略する行数。 0 は省略しない。
	nowrap: { type: Boolean, default: false }, // 改行不可
	fontSize: { type: [Number, String], default: '' }, // フォントサイズ。 数字のみの場合は、sizeTypeによって最終出力が変わる
	lineHeight: { type: [Number, String], default: '' }, // 行間
	letterSpacing: { type: String, default: '' }, // 文字間
	capHeightBaseline: { type: Boolean, default: false }, // 表示高さをキャップライン - ベースラインに合わせる。Figma "Vertical trim > cap height to baseline" と同じような設定。

	// テキスト寄せ
	left: { type: Boolean, default: false }, // 左寄せ
	right: { type: Boolean, default: false }, // 右寄せ
	center: { type: Boolean, default: false }, // 中央寄せ
	justify: { type: Boolean, default: false }, // 均等割付

	vertical: { type: Boolean, default: false }, // 縦書き

	// タイプ
	largeTitle: { type: Boolean, default: false },
	title1: { type: Boolean, default: false },
	title2: { type: Boolean, default: false },
	title3: { type: Boolean, default: false },
	headline: { type: Boolean, default: false },
	subheadline: { type: Boolean, default: false },
	lead: { type: Boolean, default: false },
	body: { type: Boolean, default: false },
	caption1: { type: Boolean, default: false },
	caption2: { type: Boolean, default: false },
	caption3: { type: Boolean, default: false },
	callout: { type: Boolean, default: false },
	footnote: { type: Boolean, default: false },
	inherit: { type: Boolean, default: false }, // 親のフォントを継承する

	// Others - その他
	transition: { type: Boolean, default: false }, // トランジションを有効にする
})

// Data --------------------------------
const type = ref<string>('')

// Computed --------------------------------
const classes = computed(() => {
	const obj: {
		typography: boolean
		[key: string]: boolean
	} = {
		typography: true,
		_bold: props.bold,
		_extrabold: props.extrabold,
		_normal: props.normal,
		_inline: props.inline,
		_left: props.left,
		_right: props.right,
		_center: props.center,
		_justify: props.justify,
		_vertical: props.vertical,
		_linebreak: props.linebreak,
		_unselectable: props.unselectable,
		_capHeightBaseline: props.capHeightBaseline,
		_nowrap: props.nowrap,
		_transition: props.transition,
		_inherit: props.inherit,
	}
	if (type.value) obj[`_${type.value}`] = true

	if (Number(props.lineclamp) > 0) {
		obj[`_lineclamp${props.lineclamp}`] = true
	}

	let color = ''
	const gradation: string = props.gradation

	// グラデーションが設定されている場合は、カラーを処理しない
	if (gradation === '') {
		// モジュールに設定されたカラーが設定されている場合は、カラーを設定する
		if (props.color !== '' && !isCssColor(props.color)) {
			color = `_color-${props.color.replace('color-', '').replace('-', '')}`
		}
	}

	obj[`${color}`] = true
	if (gradation) {
		obj[`_gradation-${gradation}`] = true
	}

	return obj
})
const styles = computed(() => {
	let styles = {}
	if (String(props.fontSize).length) {
		let fs = props.fontSize
		if (isPureNumber(String(fs))) {
			fs = getSize(Number(fs))
		}
		styles = { ...styles, fontSize: fs }
	}
	if (String(props.lineHeight).length) {
		styles = { ...styles, lineHeight: props.lineHeight }
	}
	if (props.letterSpacing.length) {
		styles = { ...styles, letterSpacing: props.letterSpacing }
	}

	// hex や rgb のカラーが設定されている場合は、color を設定する
	if (props.color !== '' && isCssColor(props.color)) {
		styles = { ...styles, color: props.color }
	}

	return styles
})

// Watch --------------------------------
// タイプの監視
watch(
	[
		() => props.largeTitle,
		() => props.title1,
		() => props.title2,
		() => props.title3,
		() => props.headline,
		() => props.subheadline,
		() => props.lead,
		() => props.body,
		() => props.caption1,
		() => props.caption2,
		() => props.caption3,
		() => props.callout,
		() => props.footnote,
		() => props.inherit,
	],
	([
		largeTitle,
		title1,
		title2,
		title3,
		headline,
		subheadline,
		lead,
		body,
		caption1,
		caption2,
		caption3,
		callout,
		footnote,
		inherit,
	]) => {
		// 優先度を文字列で type に設定する。
		if (largeTitle) type.value = 'largeTitle'
		if (title1) type.value = 'title1'
		if (title2) type.value = 'title2'
		if (title3) type.value = 'title3'
		if (headline) type.value = 'headline'
		if (subheadline) type.value = 'subheadline'
		if (lead) type.value = 'lead'
		if (body) type.value = 'body'
		if (caption1) type.value = 'caption1'
		if (caption2) type.value = 'caption2'
		if (caption3) type.value = 'caption3'
		if (callout) type.value = 'callout'
		if (footnote) type.value = 'footnote'
		if (inherit) type.value = 'inherit'
		// 優先度が設定されていない場合は、 body を設定する。
		if (!type.value) {
			type.value = 'body'
		}
	},
	{ immediate: true }, // props の初期値を監視するために immediate を true にする。
)
</script>

<style lang="scss">
@use "../../scss/_variables.scss" as var;
@use "../../scss/_mixins.scss" as mix;
@use "../../scss/_functions.scss" as func;
@use 'sass:math';

// フォントファミリー
$font-family: var(--typography-font-family);
$font-family-serif: var(--typography-font-family-serif);
$font-family-en: var(--typography-font-family-en);
$font-family-normal: var(--typography-font-family-normal);
$font-family-bold: var(--typography-font-family-bold);
$font-family-extrabold: var(--typography-font-family-extrabold);

// 各タイプのフォントファミリー
$ff-largetTitle: var(--typography-large-title-font-family);
$ff-title1: var(--typography-title1-font-family);
$ff-title2: var(--typography-title2-font-family);
$ff-title3: var(--typography-title3-font-family);
$ff-headline: var(--typography-headline-font-family);
$ff-subheadline: var(--typography-subheadline-font-family);
$ff-lead: var(--typography-lead-font-family);
$ff-body: var(--typography-body-font-family);
$ff-caption1: var(--typography-caption1-font-family);
$ff-caption2: var(--typography-caption2-font-family);
$ff-caption3: var(--typography-caption3-font-family);
$ff-callout: var(--typography-callout-font-family);
$ff-footnote: var(--typography-footnote-font-family);

// 各タイプのフォントサイズ
$fs-largetTitle: var(--typography-large-title-font-size);
$fs-title1: var(--typography-title1-font-size);
$fs-title2: var(--typography-title2-font-size);
$fs-title3: var(--typography-title3-font-size);
$fs-headline: var(--typography-headline-font-size);
$fs-subheadline: var(--typography-subheadline-font-size);
$fs-lead: var(--typography-lead-font-size);
$fs-body: var(--typography-body-font-size);
$fs-caption1: var(--typography-caption1-font-size);
$fs-caption2: var(--typography-caption2-font-size);
$fs-caption3: var(--typography-caption3-font-size);
$fs-callout: var(--typography-callout-font-size);
$fs-footnote: var(--typography-footnote-font-size);

// 各タイプのフォントウェイト
$fw-largetTitle: var(--typography-large-title-font-weight);
$fw-title1: var(--typography-title1-font-weight);
$fw-title2: var(--typography-title2-font-weight);
$fw-title3: var(--typography-title3-font-weight);
$fw-headline: var(--typography-headline-font-weight);
$fw-subheadline: var(--typography-subheadline-font-weight);
$fw-lead: var(--typography-lead-font-weight);
$fw-body: var(--typography-body-font-weight);
$fw-caption1: var(--typography-caption1-font-weight);
$fw-caption2: var(--typography-caption2-font-weight);
$fw-caption3: var(--typography-caption3-font-weight);
$fw-callout: var(--typography-callout-font-weight);
$fw-footnote: var(--typography-footnote-font-weight);

// 各タイプの行間
$lh-largetTitle: var(--typography-large-title-line-height);
$lh-title1: var(--typography-title1-line-height);
$lh-title2: var(--typography-title2-line-height);
$lh-title3: var(--typography-title3-line-height);
$lh-headline: var(--typography-headline-line-height);
$lh-subheadline: var(--typography-subheadline-line-height);
$lh-lead: var(--typography-lead-line-height);
$lh-body: var(--typography-body-line-height);
$lh-caption1: var(--typography-caption1-line-height);
$lh-caption2: var(--typography-caption2-line-height);
$lh-caption3: var(--typography-caption3-line-height);
$lh-callout: var(--typography-callout-line-height);
$lh-footnote: var(--typography-footnote-line-height);

// キャップライン - ベースラインのマージン
$cpbtop-largetTitle: var(--typography-large-title-cap-height-baseline-top);
$cpbtop-title1: var(--typography-title1-cap-height-baseline-top);
$cpbtop-title2: var(--typography-title2-cap-height-baseline-top);
$cpbtop-title3: var(--typography-title3-cap-height-baseline-top);
$cpbtop-headline: var(--typography-headline-cap-height-baseline-top);
$cpbtop-subheadline: var(--typography-subheadline-cap-height-baseline-top);
$cpbtop-lead: var(--typography-lead-cap-height-baseline-top);
$cpbtop-body: var(--typography-body-cap-height-baseline-top);
$cpbtop-caption1: var(--typography-caption1-cap-height-baseline-top);
$cpbtop-caption2: var(--typography-caption2-cap-height-baseline-top);
$cpbtop-caption3: var(--typography-caption3-cap-height-baseline-top);
$cpbtop-callout: var(--typography-callout-cap-height-baseline-top);
$cpbtop-footnote: var(--typography-footnote-cap-height-baseline-top);

$cpbbottom-largetTitle: var(--typography-large-title-cap-height-baseline-bottom);
$cpbbottom-title1: var(--typography-title1-cap-height-baseline-bottom);
$cpbbottom-title2: var(--typography-title2-cap-height-baseline-bottom);
$cpbbottom-title3: var(--typography-title3-cap-height-baseline-bottom);
$cpbbottom-headline: var(--typography-headline-cap-height-baseline-bottom);
$cpbbottom-subheadline: var(--typography-subheadline-cap-height-baseline-bottom);
$cpbbottom-lead: var(--typography-lead-cap-height-baseline-bottom);
$cpbbottom-body: var(--typography-body-cap-height-baseline-bottom);
$cpbbottom-caption1: var(--typography-caption1-cap-height-baseline-bottom);
$cpbbottom-caption2: var(--typography-caption2-cap-height-baseline-bottom);
$cpbbottom-caption3: var(--typography-caption3-cap-height-baseline-bottom);
$cpbbottom-callout: var(--typography-callout-cap-height-baseline-bottom);
$cpbbottom-footnote: var(--typography-footnote-cap-height-baseline-bottom);

$cn: '.typography'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		display: block;
		font-family: $font-family;
		color: var(--color-text);
		// letter-spacing: 0.025em;
		line-height: 1.675;
		text-align: left;
		margin: 0;

		// Types
		&._largeTitle {
			font-size: $fs-largetTitle;
			font-family: $ff-largetTitle;
			font-weight: $fw-largetTitle;
			line-height: $lh-largetTitle;

			&._capHeightBaseline {
				margin-top: $cpbtop-largetTitle;
				margin-bottom: $cpbbottom-largetTitle;
			}
		}

		&._title1 {
			font-family: $ff-title1;
			font-size: $fs-title1;
			font-weight: $fw-title1;
			line-height: $lh-title1;

			&._capHeightBaseline {
				margin-top: $cpbtop-title1;
				margin-bottom: $cpbbottom-title1;
			}
		}

		&._title2 {
			font-family: $ff-title2;
			font-size: $fs-title2;
			font-weight: $fw-title2;
			line-height: $lh-title2;

			&._capHeightBaseline {
				margin-top: $cpbtop-title2;
				margin-bottom: $cpbbottom-title2;
			}
		}

		&._title3 {
			font-family: $ff-title3;
			font-size: $fs-title3;
			font-weight: $fw-title3;
			line-height: $lh-title3;

			&._capHeightBaseline {
				margin-top: $cpbtop-title3;
				margin-bottom: $cpbbottom-title3;
			}
		}

		&._headline {
			font-family: $ff-headline;
			font-size: $fs-headline;
			font-weight: $fw-headline;
			line-height: $lh-headline;

			&._capHeightBaseline {
				margin-top: $cpbtop-headline;
				margin-bottom: $cpbbottom-headline;
			}
		}

		&._subheadline {
			font-family: $ff-subheadline;
			font-size: $fs-subheadline;
			font-weight: $fw-subheadline;
			line-height: $lh-subheadline;

			&._capHeightBaseline {
				margin-top: $cpbtop-subheadline;
				margin-bottom: $cpbbottom-subheadline;
			}
		}

		&._lead {
			font-family: $ff-lead;
			font-size: $fs-lead;
			font-weight: $fw-lead;
			line-height: $lh-lead;

			&._capHeightBaseline {
				margin-top: $cpbtop-lead;
				margin-bottom: $cpbbottom-lead;
			}
		}

		&._body {
			font-family: $ff-body;
			font-size: $fs-body;
			font-weight: $fw-body;
			line-height: $lh-body;

			&._capHeightBaseline {
				margin-top: $cpbtop-body;
				margin-bottom: $cpbbottom-body;
			}
		}

		&._caption1 {
			font-family: $ff-caption1;
			font-size: $fs-caption1;
			font-weight: $fw-caption1;
			line-height: $lh-caption1;

			&._capHeightBaseline {
				margin-top: $cpbtop-caption1;
				margin-bottom: $cpbbottom-caption1;
			}
		}

		&._caption2 {
			font-family: $ff-caption2;
			font-size: $fs-caption2;
			font-weight: $fw-caption2;
			line-height: $lh-caption2;

			&._capHeightBaseline {
				margin-top: $cpbtop-caption2;
				margin-bottom: $cpbbottom-caption2;
			}
		}

		&._caption3 {
			font-family: $ff-caption3;
			font-size: $fs-caption3;
			font-weight: $fw-caption3;
			line-height: $lh-caption3;

			&._capHeightBaseline {
				margin-top: $cpbtop-caption3;
				margin-bottom: $cpbbottom-caption3;
			}
		}

		&._callout {
			font-family: $ff-callout;
			font-size: $fs-callout;
			font-weight: $fw-callout;
			line-height: $lh-callout;

			&._capHeightBaseline {
				margin-top: $cpbtop-callout;
				margin-bottom: $cpbbottom-callout;
			}
		}

		&._footnote {
			font-family: $ff-footnote;
			font-size: $fs-footnote;
			font-weight: $fw-footnote;
			line-height: $lh-footnote;

			&._capHeightBaseline {
				margin-top: $cpbtop-footnote;
				margin-bottom: $cpbbottom-footnote;
			}
		}

		// Color
		@each $priority in var.$color-priorities {
			@each $tint in var.$color-tint {
				&._color-#{$priority}#{$tint} {
					@include mix.color-var($priority, $tint) using ($css-var) {
						color: $css-var;
					}
				}
			}
		}

		// Gradation
		@each $priority in var.$gradation-priorities {
			&._gradation-#{$priority} {
				@include mix.gradation-var($priority) using ($css-var) {
					color: transparent;
					background-color: var(--typography-mark);
					background-image: var(--typography-mark);
					background-clip: text; //テキストでくり抜く
					-webkit-text-fill-color: transparent; //くり抜いた部分は背景を表示
				}
			}
		}

		// Align
		&._left {
			text-align: left;
		}

		&._center {
			text-align: center;
		}

		&._right {
			text-align: right;
		}

		&._justify {
			text-align: justify;
		}

		// display
		&._inline {
			display: inline;
		}

		// serif
		&._serif {
			font-family: $font-family-serif;
		}

		// inherit
		&._inherit {
			font: inherit;
		}

		// ウェイト（強制）
		&._extrabold {
			font-family: var(--typography-font-family-extrabold);
			font-weight: var(--typography-font-weight-extrabold);
		}

		&._bold,
		strong {
			font-family: var(--typography-font-family-bold);
			font-weight: var(--typography-font-weight-bold);
		}

		&._normal {
			font-family: var(--typography-font-family-normal);
			font-weight: var(--typography-font-weight-normal);
		}

		// 縦書き
		&._vertical {
			writing-mode: vertical-rl;
		}

		// 改行文字での改行を可能にするのと、
		// ボックス幅を超過する時は折り返す設定。
		&._linebreak {
			// pre-line によって、改行コードによって改行されるようになると同時に、
			// 空白文字（タブを含む）が連続している場合は1つの空白文字に置き換えられます。
			white-space: pre-line;
			word-break: break-all;
		}

		// 改行不可
		&._nowrap {
			white-space: nowrap;
		}

		// テキスト選択不可
		&._unselectable {
			user-select: none;
		}

		// 表示高さをキャップライン - ベースラインに合わせる
		// Figma "Vertical trim > cap height to baseline" と同じような設定。
		&._capHeightBaseline {
			margin-top: -0.4em;
			margin-bottom: -0.4em;
		}

		// 省略する行数
		&._lineclamp1 {
			@include mix.lineClamp(1);
		}

		&._lineclamp2 {
			@include mix.lineClamp(2);
		}

		&._lineclamp3 {
			@include mix.lineClamp(3);
		}

		&._lineclamp4 {
			@include mix.lineClamp(4);
		}

		&._lineclamp5 {
			@include mix.lineClamp(5);
		}

		&._transition {
			transition: var.$transition-base;
		}

		&._largeTitle {
			font-size: $fs-largetTitle;
		}

		&._title1 {
			font-size: $fs-title1;
		}

		&._title2 {
			font-size: $fs-title2;
		}

		&._title3 {
			font-size: $fs-title3;
		}

		&._headline {
			font-size: $fs-headline;
		}

		&._subheadline {
			font-size: $fs-subheadline;
		}

		&._lead {
			font-size: $fs-lead;
		}

		&._body {
			font-size: $fs-body;
		}

		&._caption1 {
			font-size: $fs-caption1;
		}

		&._caption2 {
			font-size: $fs-caption2;
		}

		&._caption3 {
			font-size: $fs-caption3;
		}

		&._callout {
			font-size: $fs-callout;
		}

		&._footnote {
			font-size: $fs-footnote;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

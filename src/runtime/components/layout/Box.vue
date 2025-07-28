<template>
	<component :is="tag" class="box" :class="classes" :style="styles">
		<slot />
	</component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCss } from '../../composables/css'
import { useNumber } from '../../composables/number'
import { useRegex } from '../../composables/regex'

// Composables -------------------------------------
const { getSize } = useCss() // css に関する関数
const { isPureNumber } = useNumber() // 数値 に関する関数
const { isColorHexOrRgbOrRgba } = useRegex()

// Props --------------------------------
const props = defineProps({
	tag: { type: String, default: 'div' },
	disabled: { type: Boolean, default: false }, // 無効化
	color: { type: String, default: '' }, // モジュールに設定されたカラー、または、#hex、rgb(r,g,b)、rgba(r,g,b,a) のカラー
	gradation: { type: String, default: '' }, // グラデーションの設定
	// Size - 大きさ
	w: { type: [Number, String], default: '' }, // 横幅 px
	minW: { type: [Number, String], default: -1 }, // 最小横幅 px
	maxW: { type: [Number, String], default: -1 }, // 最大横幅 px
	h: { type: [Number, String], default: '' }, // 高さ px
	minH: { type: [Number, String], default: -1 }, // 最小高さ px
	maxH: { type: [Number, String], default: -1 }, // 最大高さ px

	// Padding & Margin - パディングとマージン
	p: { type: [Number, String], default: '' }, // padding
	pt: { type: [Number, String], default: '' }, // padding top
	pr: { type: [Number, String], default: '' }, // padding right
	pb: { type: [Number, String], default: '' }, // padding bottom
	pl: { type: [Number, String], default: '' }, // padding left
	m: { type: [Number, String], default: '' }, // margin
	mt: { type: [Number, String], default: '' }, // margin top
	mr: { type: [Number, String], default: '' }, // margin right
	mb: { type: [Number, String], default: '' }, // margin bottom
	ml: { type: [Number, String], default: '' }, // margin left

	// Border Radius - 角丸
	r: { type: [Number, String], default: '' }, // 角丸, full = 9999px, circle = 100%

	// Position - 位置
	relative: { type: Boolean, default: false },
	absolute: { type: Boolean, default: false },
	fixed: { type: Boolean, default: false },
	sticky: { type: Boolean, default: false },
	top: { type: [String, Number], default: '' },
	right: { type: [String, Number], default: '' },
	bottom: { type: [String, Number], default: '' },
	left: { type: [String, Number], default: '' },
	zIndex: { type: [String, Number], default: '' },

	// Transform - 変形
	rotate: { type: [String, Number], default: '' }, // 回転
	scale: { type: [String, Number], default: '' }, // スケール
	x: { type: [String, Number], default: '' }, // x軸平行移動
	y: { type: [String, Number], default: '' }, // y軸平行移動

	// Others - その他
	animation: { type: Boolean, default: false }, // アニメーションを有効にする
	overflow: { type: Boolean, default: false }, // 見切れを非表示にする
	bgBlur: { type: Boolean, default: false }, // 背景ぼかしを有効にする
	inlineBlock: { type: Boolean, default: false }, // インラインブロック
})

// Computed ---------------------------------
const classes = computed(() => {
	let color: string = ''
	const gradation: string = props.gradation

	// グラデーションが設定されている場合は、カラーを処理しない
	if (gradation === '') {
		// モジュールに設定されたカラーが設定されている場合は、カラーを設定する
		if (props.color !== '' && !isColorHexOrRgbOrRgba(props.color)) {
			color = props.color
			color = `_color-${color.replace('color-', '').replace('-', '')}`
		}
	}

	let position = ''
	if (props.relative) position = 'relative'
	if (props.absolute) position = 'absolute'
	if (props.fixed) position = 'fixed'
	if (props.sticky) position = 'sticky'

	return {
		...(color && { [color]: true }),
		...(gradation && { [`_gradation-${gradation}`]: true }),
		...(position && { [`_${position}`]: true }),
		_overflow: props.overflow,
		_animation: props.animation,
		_bgBlur: props.bgBlur,
		_inlineBlock: props.inlineBlock,
		...(props.disabled && { _disabled: true }),
	}
})
// 横幅縦幅の設定
const size = computed(() => {
	let width: string = ''
	let minWidth: string = ''
	let maxWidth: string = ''
	let height: string = ''
	let minHeight: string = ''
	let maxHeight: string = ''
	if (isPureNumber(String(props.w))) {
		width = getSize(Number(props.w))
	}
	else {
		width = String(props.w)
	}
	if (isPureNumber(String(props.minW))) {
		if (Number(props.minW) >= 0) {
			minWidth = getSize(Number(props.minW))
		}
	}
	else {
		minWidth = String(props.minW)
	}
	if (isPureNumber(String(props.maxW))) {
		if (Number(props.maxW) >= 0) {
			maxWidth = getSize(Number(props.maxW))
		}
	}
	else {
		maxWidth = String(props.maxW)
	}
	if (isPureNumber(String(props.h))) {
		height = getSize(Number(props.h))
	}
	else {
		height = String(props.h)
	}
	if (isPureNumber(String(props.minH))) {
		if (Number(props.minH) >= 0) {
			minHeight = getSize(Number(props.minH))
		}
	}
	else {
		minHeight = String(props.minH)
	}
	if (isPureNumber(String(props.maxH))) {
		if (Number(props.maxH) >= 0) {
			maxHeight = getSize(Number(props.maxH))
		}
	}
	else {
		maxHeight = String(props.maxH)
	}
	return {
		...(width !== '' && { width }),
		...(minWidth !== '' && { minWidth }),
		...(maxWidth !== '' && { maxWidth }),
		...(height !== '' && { height }),
		...(minHeight !== '' && { minHeight }),
		...(maxHeight !== '' && { maxHeight }),
	}
})
// パディングの設定
const padding = computed(() => {
	let paddingTop: string = ''
	let paddingRight: string = ''
	let paddingBottom: string = ''
	let paddingLeft: string = ''
	if (props.p) {
		if (isPureNumber(String(props.p))) {
			return {
				padding: getSize(Number(props.p)),
			}
		}
		else {
			return {
				padding: props.p,
			}
		}
	}
	else {
		if (isPureNumber(String(props.pt))) {
			paddingTop = getSize(Number(props.pt))
		}
		else {
			paddingTop = String(props.pt)
		}
		if (isPureNumber(String(props.pr))) {
			paddingRight = getSize(Number(props.pr))
		}
		else {
			paddingRight = String(props.pr)
		}
		if (isPureNumber(String(props.pb))) {
			paddingBottom = getSize(Number(props.pb))
		}
		else {
			paddingBottom = String(props.pb)
		}
		if (isPureNumber(String(props.pl))) {
			paddingLeft = getSize(Number(props.pl))
		}
		else {
			paddingLeft = String(props.pl)
		}
		return {
			...(paddingTop !== '' && { paddingTop }),
			...(paddingRight !== '' && { paddingRight }),
			...(paddingBottom !== '' && { paddingBottom }),
			...(paddingLeft !== '' && { paddingLeft }),
		}
	}
})
// マージン設定
const margin = computed(() => {
	let marginTop: string = ''
	let marginRight: string = ''
	let marginBottom: string = ''
	let marginLeft: string = ''
	if (props.m) {
		if (isPureNumber(String(props.m))) {
			return {
				margin: getSize(Number(props.m)),
			}
		}
		else {
			return {
				margin: props.m,
			}
		}
	}
	else {
		if (isPureNumber(String(props.mt))) {
			marginTop = getSize(Number(props.mt))
		}
		else {
			marginTop = String(props.mt)
		}
		if (isPureNumber(String(props.mr))) {
			marginRight = getSize(Number(props.mr))
		}
		else {
			marginRight = String(props.mr)
		}
		if (isPureNumber(String(props.mb))) {
			marginBottom = getSize(Number(props.mb))
		}
		else {
			marginBottom = String(props.mb)
		}
		if (isPureNumber(String(props.ml))) {
			marginLeft = getSize(Number(props.ml))
		}
		else {
			marginLeft = String(props.ml)
		}
		return {
			...(marginTop !== '' && { marginTop }),
			...(marginRight !== '' && { marginRight }),
			...(marginBottom !== '' && { marginBottom }),
			...(marginLeft !== '' && { marginLeft }),
		}
	}
})
// 角丸
const borderRadius = computed(() => {
	let radius: string = ''
	if (isPureNumber(String(props.r))) {
		radius = getSize(Number(props.r))
	}
	else {
		if (props.r === 'full') {
			radius = '9999px'
		}
		else if (props.r === 'circle') {
			radius = '100%'
		}
		else {
			radius = String(props.r)
		}
	}
	return {
		borderRadius: radius,
	}
})
// 位置
const inset = computed(() => (type: 'top' | 'right' | 'left' | 'bottom') => {
	const target = props[type]
	let value = ''
	if (isPureNumber(String(target))) {
		value = getSize(Number(target))
	}
	else {
		value = String(target)
	}
	return value
})
// 変形
const transform = computed(() => {
	let str = ''
	if (props.rotate !== '') str += `rotate(${props.rotate}deg) `
	if (props.scale !== '') str += `scale(${props.scale}) `

	let translateX = ''
	let translateY = ''
	if (isPureNumber(String(props.x))) {
		translateX = getSize(Number(props.x))
	}
	else {
		translateX = String(props.x)
	}
	if (isPureNumber(String(props.y))) {
		translateY = getSize(Number(props.y))
	}
	else {
		translateY = String(props.y)
	}
	if (translateX !== '') str += `translateX(${translateX}) `
	if (translateY !== '') str += `translateY(${translateY}) `
	return { transform: str }
})

const styles = computed(() => {
	const baseStyles = {
		...size.value,
		...padding.value,
		...margin.value,
		...borderRadius.value,
		...transform.value,
		...(inset.value('top') !== '' && { top: inset.value('top') }),
		...(inset.value('right') !== '' && { right: inset.value('right') }),
		...(inset.value('bottom') !== '' && { bottom: inset.value('bottom') }),
		...(inset.value('left') !== '' && { left: inset.value('left') }),
		...(props.zIndex !== '' && { zIndex: props.zIndex }),
	}

	// hex、rgb、rgba のカラーが設定されている場合は、background-color を設定する
	if (props.color !== '' && isColorHexOrRgbOrRgba(props.color)) {
		return { ...baseStyles, backgroundColor: props.color }
	}

	return baseStyles
})
</script>

<style lang="scss">
@use "../../scss/_variables.scss" as var;
@use "../../scss/_mixins.scss" as mix;
$cn: 'box'; // コンポーネントクラス名

.#{$cn} {
	display: block;

	&._inlineBlock {
		display: inline-block;
	}

	&._disabled {
		pointer-events: none;
	}

	&._overflow {
		overflow: hidden;
	}

	&._animation {
		transition: var.$transition-base;
	}

	// 位置
	&._relative {
		position: relative;
	}

	&._absolute {
		position: absolute;
	}

	&._fixed {
		position: fixed;
	}

	&._sticky {
		position: sticky;
	}

	// 背景ぼかし
	&._bgBlur {
		backdrop-filter: var.$backdrop-filter;
	}

	// Color
	@each $priority in var.$color-priorities {
		@each $tint in var.$color-tint {
			&._color-#{$priority}#{$tint} {
				@include mix.color-var($priority, $tint) using ($css-var) {
					background-color: $css-var;
				}
			}
		}
	}

	// Gradation
	@each $priority in var.$gradation-priorities {
		&._gradation-#{$priority} {
			@include mix.gradation-var($priority) using ($css-var) {
				background-image: $css-var;
			}
		}
	}
}
</style>

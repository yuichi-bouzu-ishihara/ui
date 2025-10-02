<!--
	Icon を表示するコンポーネント
	1. モジュールに設定済みのアイコンを表示する。 src/runtime/assets/ui-component/icons
	2. 1にないものは、モジュール使用先の /public/assets/icons に svg アイコンファイルを設置して表示する。
 -->
<template>
	<i class="icon" :class="classes" :style="styles" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIcon } from '../../composables/elements/icon'
import { useCss } from '../../composables/css'
import { useGradation } from '../../composables/gradation'
import { useNumber } from '../../composables/number'
import { useRegex } from '../../composables/regex'

// Stores & Composables -------------------------------------
const { getSize } = useCss() // css に関する関数
const { isPureNumber } = useNumber() // 数値に関する関数
const { isCssColor } = useRegex()

// Props -------------------------------------
const props = defineProps({
	color: { type: String, default: 'text' }, // モジュールに設定されたカラー、または、#hex、rgb(r,g,b)、rgba(r,g,b,a) のカラー
	gradation: { type: String, default: '' }, // グラデーションの設定
	originalColor: { type: Boolean, default: false }, // カラーを svg のオリジナルカラーにするかどうか
	name: { type: String, default: '' },
	size: { type: [Number, String], default: 11 },
})

// Computed -------------------------------------
const classes = computed(() => {
	let color = ''

	// モジュールに設定されたカラーが設定されている場合は、カラーを設定する
	if (props.color !== '' && !isCssColor(props.color)) {
		color = `_color-${props.color.replace('color-', '').replace('-', '')}`
	}

	// グラデーションが設定されている場合は、カラーを空にする
	if (props.gradation !== '') {
		color = ''
	}

	return {
		_original: props.originalColor,
		[`${color}`]: true,
	}
})
const styles = computed(() => {
	let value = ''
	if (isPureNumber(props.size)) {
		const size = Number(props.size)
		value = getSize(size)
	}
	else {
		value = String(props.size)
	}
	// アイコン画像設定
	let img = {}
	if (image.value !== '') {
		if (props.originalColor) {
			img = {
				backgroundImage: `url(${image.value})`,
			}
		}
		else {
			img = {
				maskImage: `url(${image.value})`,
			}
		}
	}
	if (props.gradation !== '') {
		img = {
			...img,
			backgroundImage: `${useGradation().variables(props.gradation)}`,
		}
	}
	else if (props.color !== '' && isCssColor(props.color)) {
		img = {
			...img,
			backgroundColor: props.color,
		}
	}
	return { width: value, height: value, ...img }
})
const image = computed(() => {
	return useIcon().reference(props.name)
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;

@mixin icon-base() {
	display: inline-block;
	mask-position: center;
	mask-repeat: no-repeat;
	mask-size: cover;
	// transition-property: opacity, background-color;
	// transition-duration: 0.25s;
	// transition-timing-function: ease;
}

@mixin icon-color($color) {
	background-color: $color;
}

@mixin icon-original() {
	mask-image: none;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	background-color: transparent;
}

// すべてのアイコンを作成する（styleで.iconで作成する用）
@mixin icon-all {
	@include icon-base();
	@include icon-color(var(--color-dark));

	// Color
	@each $priority in var.$color-priorities {
		@each $tint in var.$color-tint {
			&._color-#{$priority}#{$tint} {
				@include mix.color-var($priority, $tint) using ($css-var) {
					@include icon-color($css-var);
				}
			}
		}
	}

	// svg のオリジナルカラーを使用する場合
	&._original {
		@include icon-original();
	}
}

.icon {
	@include icon-all();
}
</style>

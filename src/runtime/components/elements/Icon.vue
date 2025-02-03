<!--
	Icon を表示するコンポーネント
	1. モジュールに設定済みのアイコンを表示する。 src/runtime/assets/ui-component/icons
	2. 1にないものは、モジュール使用先の /public/assets/icons に svg アイコンファイルを設置して表示する。
 -->
<template>
	<i class="icon" :class="classes" :style="styles" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useIcon } from '../../composables/elements/icon'
import { useMode } from '../../composables/mode'
import { useCss } from '../../composables/css'
import { useGradation } from '../../composables/gradation'
import { useNumber } from '../../composables/number'

// Stores & Composables -------------------------------------
const { getSize } = useCss() // css に関する関数
const { isPureNumber } = useNumber() // 数値に関する関数
const { darkmode } = useMode()

// Props -------------------------------------
const props = defineProps({
	color: { type: String, default: 'text' }, // カラーの設定
	gradation: { type: String, default: '' }, // グラデーションの設定
	originalColor: { type: Boolean, default: false }, // カラーを svg のオリジナルカラーにするかどうか
	name: { type: String, default: '' },
	size: { type: [Number, String], default: 11 },
})

// Data -------------------------------------
const image = ref('')
const nameClass = ref('')

// Computed -------------------------------------
const classes = computed(() => {
	let color = `_color-${props.color.replace('color-', '').replace('-', '')}`

	// グラデーションが設定されている場合は、カラーを空にする
	if (props.gradation !== '') {
		color = ''
	}

	return {
		_original: props.originalColor,
		[`${color}`]: true,
		[`${nameClass.value}`]: true,
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
	return { width: value, height: value, ...img }
})

// Watchers -------------------------------------
watch(() => props.name, async (nv) => {
	if (nv !== '') {
		const data = useIcon().reference(nv)
		if (data.class) {
			nameClass.value = data.class
		}
		if (data.path) {
			image.value = data.path
		}
	}
}, { immediate: true })
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../assets/bouzu-ui/icons/_names.scss' as names;

@mixin icon-base() {
	display: inline-block;
	mask-position: center;
	mask-repeat: no-repeat;
	mask-size: cover;
	transition-property: opacity, background-color;
	transition-duration: 0.25s;
	transition-timing-function: ease;
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

	// icon is-name is-primary のように、 名前とカラーを設定する
	@each $nameStr in names.$str {
		&:not(._original)._#{$nameStr} {
			mask-image: url(../../assets/bouzu-ui/icons/#{$nameStr}.svg);
		}

		// svg のオリジナルカラーを使用する場合
		&._original._#{$nameStr} {
			background-image: url(../../assets/bouzu-ui/icons/#{$nameStr}.svg);
		}
	}

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

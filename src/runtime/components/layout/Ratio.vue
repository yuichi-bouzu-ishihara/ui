<template>
	<div class="ratio" :class="classes">
		<div class="ratio-container" :style="perStyle">
			<Row class="ratio-container-inner" justify="center" align="center">
				<slot />
			</Row>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props ------------------
const props = defineProps({
	golden: { type: Boolean, default: false }, // 黄金比
	square: { type: Boolean, default: false }, // 正方形
	cinema: { type: Boolean, default: false }, // シネマスコープ 2.35:1
	ultraWideGaming: { type: Boolean, default: false }, // ウルトラワイドゲーミング 32:9
	overflow: { type: String, default: 'hidden', validator: (value: string) => ['hidden', 'visible'].includes(value) }, // 見切れ表示
	per: { type: [Number, String], default: 0 }, // 横幅に対する縦幅をパーセントで指定する。
})

// Data ------------------
const ratio = ref<string>('')

// Watch ---------------------------
watch(
	[() => props.golden, () => props.square, () => props.cinema, () => props.ultraWideGaming, () => props.per],
	([newGolden, newSquare, newCinema, newUltraWideGaming, newPer]) => {
		// 優先度を文字列で type に設定する。
		if (newGolden) ratio.value = 'golden'
		if (newSquare) ratio.value = 'square'
		if (newCinema) ratio.value = 'cinema'
		if (newUltraWideGaming) ratio.value = 'ultraWideGaming'
		// 設定されていない場合は、 golden を設定する。
		if (!ratio.value && !newPer) {
			ratio.value = 'golden'
		}
	},
	{ immediate: true }, // props の初期値を監視するために immediate を true にする。
)

// Computed ---------------------------
const classes = computed(() => {
	return {
		[`_overflow${props.overflow.charAt(0).toUpperCase() + props.overflow.slice(1)}`]: true,
		[`_${ratio.value}`]: true,
	}
})
const perStyle = computed(() => {
	let obj = {}
	if (props.per) {
		obj = { paddingTop: `${props.per}%` }
	}
	return obj
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.ratio'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		width: 100%;

		&._golden &-container {
			padding-top: calc(100% / 1.614);
		}

		&._square &-container {
			padding-top: 100%;
		}

		&._cinema &-container {
			padding-top: calc(100% / 2.35);
		}

		&._ultraWideGaming &-container {
			padding-top: calc(100% * 9 / 32);
		}

		&-container {
			position: relative;
			height: 100%;

			&-inner {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
		}

		&._overflowVisible {
			#{$cn}-container {
				overflow: visible;
			}
		}

		&._overflowHidden {
			#{$cn}-container {
				overflow: hidden;
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

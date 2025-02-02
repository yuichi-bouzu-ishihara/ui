<template>
	<a v-if="isExternalLink" class="basicLink" :class="classes" v-bind="{ href, target }">
		<slot />
	</a>
	<NuxtLink v-else class="basicLink" :class="classes" v-bind="{ to, replace, target }" exact-active-class="_active">
		<slot />
	</NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props ------------------
const props = defineProps({
	to: { type: [String, Object], default: '' }, // 遷移先 url path。 disabled の場合は空文字を設定する。
	replace: { type: Boolean, default: false }, // ページ遷移を replace にする
	blank: { type: Boolean, default: false }, // 新規タブで開く
	noHoverStyle: { type: Boolean, default: false }, // hover スタイルを無効化する
	highlight: { type: Boolean, default: false }, // タップ（アクティブ）時のハイライトスタイル設定
	underline: { type: Boolean, default: false }, // 下線を引く
})
// Computed ------------------
const classes = computed(() => {
	return {
		_disabled: props.to === '',
		_noHoverStyle: props.noHoverStyle,
		_highlight: props.highlight,
		_underline: props.underline,
	}
})
// 外部リンクかどうか
const isExternalLink = computed(() => {
	return typeof props.to === 'string' && /^(https?:)?\/\//.test(props.to)
})
const target = computed(() => {
	return props.blank ? '_blank' : '_self'
})
const href = computed(() => {
	return props.to
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;

$cn: '.basicLink'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		color: var(--color-link);
		transition: var.$transition-base;
		@include mix.tap-highlight-transparent();

		&:not(._noHoverStyle) {
			&:hover:not(._disabled) {
				opacity: 0.6;
			}

			&:active:not(._disabled) {
				opacity: 0.5;
			}
		}

		&._disabled {
			pointer-events: none;
		}

		&._highlight {
			-webkit-tap-highlight-color: var(--color-light-050);
			/* 黄色の半透明 */
		}

		&._underline {
			text-decoration: underline;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

<template>
	<component :is="tag" class="container" :class="classes">
		<slot />
	</component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// Props --------------------------------
const props = defineProps({
	tag: { type: String, default: 'div' },

	// サイズ
	full: { type: Boolean, default: false },
	wide: { type: Boolean, default: false },
	narrow: { type: Boolean, default: false },

	// padding をなくす
	noPadding: { type: Boolean, default: false },

	// 縦幅を親要素に合わせる
	fit: { type: Boolean, default: false },
})

// Data --------------------------------
const size = ref<string>('')

// Computed --------------------------------
const classes = computed(() => {
	return {
		[`_${size.value}`]: true,
		_noPadding: props.noPadding,
		_fit: props.fit,
	}
})

// Watch ---------------------------
watch(
	[() => props.full, () => props.wide, () => props.narrow],
	([newFull, newWide, newNarrow]: [boolean, boolean, boolean]) => {
		size.value = ''
		// 優先度を文字列で type に設定する。
		if (newFull) size.value = 'full'
		if (newWide) size.value = 'wide'
		if (newNarrow) size.value = 'narrow'
	},
	{ immediate: true }, // props の初期値を監視するために immediate を true にする。
)
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.container'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		max-width: 100%;
		width: var(--container-base-width);
		padding-right: var(--container-base-side-space);
		padding-left: var(--container-base-side-space);
		margin-right: auto;
		margin-left: auto;

		&._full {
			max-width: 100%;
			width: 100%;
			padding-right: var(--container-full-side-space);
			padding-left: var(--container-full-side-space);
		}

		&._wide {
			width: var(--container-wide-width);
			padding-right: var(--container-wide-side-space);
			padding-left: var(--container-wide-side-space);
		}

		&._narrow {
			width: var(--container-narrow-width);
			padding-right: var(--container-narrow-side-space);
			padding-left: var(--container-narrow-side-space);
		}

		&._noPadding {
			padding-right: 0;
			padding-left: 0;
		}

		&._fit {
			height: 100%;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

<template>
	<div ref="el" class="scrollX" :class="classes">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props ------------------
const props = defineProps({
	disabled: { type: Boolean, default: false }, // スクロール不可
	bar: { type: Boolean, default: true }, // スクロールバー表示
})

// Data ---------------------------------------------------------
const el = ref<HTMLElement | null>(null)

// Emit ---------------------------------------------------------
// const emit = defineEmits(['start', 'end', 'scroll'])

// Computed --------------------------------------------------------
const classes = computed(() => {
	return {
		_scroll: !props.disabled,
		_scrollBar: props.bar,
	}
})
</script>

<style lang="scss">
@use '../../scss/_mixins.scss' as mix;
$cn: '.scrollX'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		width: 100%;
		height: 100%;

		&._scroll {
			overflow-x: scroll;
		}

		// スクロールバー非表示
		&:not(._scrollBar) {
			-ms-overflow-style: none;
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

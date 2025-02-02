<template>
	<Center class="dialogContainer" :class="classes">
		<div class="dialogContainer-inner">
			<slot />
		</div>
	</Center>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Center from '../layout/Center.vue'

const props = defineProps({
	// paddingをなくす
	paddingNone: { type: Boolean, default: false },

	// backgroundをなくす
	backgroundNone: { type: Boolean, default: false },

	// overflow設定。false:visible
	overflow: { type: Boolean, default: true },
})

// Computed ------------------
const classes = computed(() => {
	return {
		_paddingNone: props.paddingNone,
		_backgroundNone: props.backgroundNone,
		_overflow: props.overflow,
	}
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.dialogContainer'; // コンポーネントセレクタ名

$width: 284;
$padding-v: 24;
$padding-h: 28;

@include mix.component-styles($cn) using ($mode) {

	@if $mode =='base' {
		margin: auto;
		width: func.get-size($width);
		max-width: 100%;
		min-height: func.get-size($width);
		padding: func.get-size($padding-v) func.get-size($padding-h);
		background-color: var(--color-background);
		border-radius: func.get-size(4);

		&-inner {
			width: func.get-size($width - $padding-h * 2);
		}

		&._paddingNone {
			padding: 0;
		}

		&._backgroundNone {
			background-color: transparent;
		}

		&._overflow {
			overflow: hidden;
		}
	}

	@if $mode =='darkmode' {
		background-color: var(--color-dark);
	}

	@if $mode =='auto' {
		width: func.get-size($width, false);
		min-height: func.get-size($width, false);
		padding: func.get-size($padding-v, false) func.get-size($padding-h, false);

		&-inner {
			width: func.get-size($width - $padding-h * 2, false);
		}
	}
}
</style>

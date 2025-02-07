<template>
	<hr class="line">
</template>

<script setup lang="ts">
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.line'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		width: 100%;
		height: 0.5px;
		margin: 0;
		border: none;
		background-color: var(--color-text-020);
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

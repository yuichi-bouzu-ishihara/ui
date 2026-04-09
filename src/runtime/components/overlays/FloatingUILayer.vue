<template>
	<div class="floatingUILayer">
		<div id="floatingUI" />
	</div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
$cn: '.floatingUILayer';

#{$cn} {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	width: 100%;
}
</style>

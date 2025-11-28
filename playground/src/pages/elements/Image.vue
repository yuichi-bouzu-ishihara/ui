<template>
	<div class="pageElementsLogo">
		<Image src="https://cdn.pixabay.com/photo/2024/01/10/13/13/ai-generated-8499585_1280.png" @ready="handleReady"
			@loaded="handleLoaded" />
	</div>
</template>

<script lang="ts" setup>
const handleReady = () => {
	console.log('Image ready')
}
const handleLoaded = () => {
	console.log('Image loaded')
}
</script>

<style lang="scss"></style>

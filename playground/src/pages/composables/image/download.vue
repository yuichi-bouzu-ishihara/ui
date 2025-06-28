<template>
	<div class="pageComposablesImage">
		<Center>
			<Button @click="download('https://cdn.pixabay.com/photo/2024/01/10/13/13/ai-generated-8499585_1280.png')">
				Download
			</Button>
		</Center>
	</div>
</template>

<script setup>
const { download } = useImage()
</script>

<style lang="scss"></style>

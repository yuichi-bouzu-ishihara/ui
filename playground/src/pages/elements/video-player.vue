<template>
	<Container>
		<FileUpload v-if="!file" v-model="file" accept=".mp4" :max-size="1024 * 1024 * 1024" />
		<VideoPlayer v-else-if="src" :src="src" controls mute />
	</Container>
</template>

<script setup>
const file = ref(null)
const src = ref('')

// Watch -------------------------------------------
watch(() => file.value, async (newVal) => {
	if (newVal) {
		src.value = URL.createObjectURL(newVal)
	}
})
</script>

<style lang="scss"></style>

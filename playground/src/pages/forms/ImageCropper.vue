<template>
	<div class="pageFormsImageCropper">
		<Container>
			<FileUpload v-if="!file" v-model="file" accept="image" />
			<ImageCropper v-else-if="src" :src="src" :trim-width="528" :trim-height="264" :output-width="528"
				:output-height="264" />
		</Container>
	</div>
</template>

<script setup>
const file = ref(null)
const src = ref('')

// Watch -------------------------------------------
watch(() => file.value, async (newVal) => {
	if (newVal) {
		src.value = await useFile().fileToBase64(newVal)
	}
})
</script>

<style lang="scss"></style>

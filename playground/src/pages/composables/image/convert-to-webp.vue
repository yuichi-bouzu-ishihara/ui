<template>
	<div class="pageComposablesImage">
		<Center>
			<Container>
				<Column gap="40">
					<Image v-if="webpImage" :src="webpImage" />
					<Button @click="webp">
						Select Image File and Convert to WebP
					</Button>
				</Column>
			</Container>
		</Center>
	</div>
</template>

<script setup>
const { toWebP, blobToBase64 } = useImage()
const webpImage = ref('')

const webp = async () => {
	const file = await useFile().select()
	const blob = await toWebP(file.blob)
	const base64 = await blobToBase64(blob)
	webpImage.value = base64
}
</script>

<style lang="scss"></style>

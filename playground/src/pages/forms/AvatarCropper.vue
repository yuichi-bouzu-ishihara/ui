<template>
	<div class="pageFormsAvatarCropper">
		<Container narrow>
			<Box w="100%" h="348" mt="2">
				<template v-if="value">
					<AvatarCropper ref="cropper" :src="value" />
				</template>
				<template v-else>
					<Ratio square>
						<FileUpload v-model="file" accept=".jpg,.jpeg,.png" :label="{ idle: 'フェイス画像を選択' }"
							:description="{ idle: '幅480px・高さ480px 以上の PNG / JPG ファイル' }" :max-size="100 * 1024 * 1024"
							style="width: 100%; height: 100%;" />
					</Ratio>
					<Box h="40" />
				</template>
			</Box>
		</Container>
	</div>
</template>

<script setup>
const value = ref('')
const file = ref(null)

// Watch -------------------------------------------
watch(() => file.value, async (newVal) => {
	if (newVal) {
		value.value = await useFile().fileToBase64(newVal)
	}
})
</script>

<style lang="scss"></style>

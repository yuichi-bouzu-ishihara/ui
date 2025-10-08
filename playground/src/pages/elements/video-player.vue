<template>
	<Container>
		<FileUpload v-if="!file" v-model="file" accept=".mp4" :max-size="1024 * 1024 * 1024" />
		<Column v-else-if="src" gap="20">
			<VideoPlayer v-model:muted="muted" v-bind="{ src }" controls />
			<Row justify="center" gap="20">
				<Clickable @click="muted = !muted">
					<Icon :name="muted ? 'volumeOff' : 'volume'" size="20" />
				</Clickable>
			</Row>
		</Column>
	</Container>
</template>

<script setup>
const file = ref(null)
const src = ref('')
const muted = ref(false)

// Watch -------------------------------------------
watch(() => file.value, async (newVal) => {
	if (newVal) {
		src.value = URL.createObjectURL(newVal)
	}
})
</script>

<style lang="scss"></style>

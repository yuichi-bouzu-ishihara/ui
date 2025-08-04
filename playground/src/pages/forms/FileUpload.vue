<template>
	<Column class="pageFormsFileUpload" gap="40">
		<Container narrow>
			<FileUpload v-model="value" />
		</Container>
		<TransitionAcordion>
			<Typography v-if="value" caption3 center>
				{{ value.name }}<br>
				{{ value.size }} bytes
			</Typography>
		</TransitionAcordion>
	</Column>
</template>

<script setup>
const value = ref(null)
</script>

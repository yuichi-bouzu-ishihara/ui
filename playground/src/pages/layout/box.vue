<template>
	<Box w="100vw">
		<Container wide>
			<Row justify="center" v-bind="{ gap }">
				<Box w="100" h="100" color="primary" />
				<Box w="100" h="100" gradation="special" />
				<Box w="100" h="100" color="dark" />
			</Row>
		</Container>
	</Box>
</template>

<script setup>
// Data
const gap = ref('2')
</script>

<style lang="scss"></style>

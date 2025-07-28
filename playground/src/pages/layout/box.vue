<template>
	<Box w="100vw">
		<Container wide>
			<Row justify="center" v-bind="{ gap }">
				<Box w="100" h="100" p="20" color="primary" />
				<Box w="100" h="100" gradation="special" />
				<Box w="100" h="100" color="dark" />
				<Box w="100" h="100" />
				<Box w="100" h="100" color="#00ff00" />
				<Box w="100" h="100" color="rgba(0, 0, 255, 0.5)" />
			</Row>
		</Container>
	</Box>
</template>

<script setup>
// Data
const gap = ref('2')
</script>

<style lang="scss"></style>

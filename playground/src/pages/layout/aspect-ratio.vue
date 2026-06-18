<template>
	<Box w="100vw" h="100%" pt="40">
		<Box w="500" h="200">
			<AspectRatio :value="ratio">
				<Box color="text-060" w="100%" h="100%" pt="4" pl="8" />
			</AspectRatio>
		</Box>
	</Box>
</template>

<script setup>
// Data ------------------
const ratio = ref('9 / 16')
</script>

<style lang="scss"></style>

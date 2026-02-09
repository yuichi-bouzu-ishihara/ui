<template>
	<Box w="100vw" pt="40">
		<Center>
			<Box w="400">
				<AspectRatio :value="ratio">
					<Box color="text-060" w="100%" h="100%" pt="4" pl="8" />
				</AspectRatio>
			</Box>
		</Center>
	</Box>
</template>

<script setup>
// Data ------------------
const ratio = ref('16 / 9')
</script>

<style lang="scss"></style>

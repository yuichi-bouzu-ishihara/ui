<template>
	<Box w="100vw">
		<Container wide>
			<Box h="60">
				<Row fit-h align="stretch" v-bind="{ gap }">
					<SkeletonShape w="100" h="100%" />
					<SkeletonShape w="100" h="100%" />
				</Row>
			</Box>
			<Box h="20" />
			<Row v-bind="{ gap, split }">
				<Ratio v-for="i in 10" :key="i">
					<SkeletonShape w="100%" h="100%" :animation="false" />
				</Ratio>
			</Row>
		</Container>
	</Box>
</template>

<script setup>
// Data
const gap = ref('2')
const split = ref(3)
</script>

<style lang="scss"></style>

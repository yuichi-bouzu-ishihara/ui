<template>
	<Container full>
		<Column justify="center" gap="12" fit-w>
			<Row justify="center" gap="12">
				<Box v-for="i in 100" :key="i" w="120" pt="20" pb="20" pr="20" pl="20">
					<Column justify="center" gap="8">
						<SkeletonShape avatar w="72" :color="`rgba(${color.hexToRgb('#ff0000')}, 0.5)`" />
						<SkeletonShape w="96" h="16" />
						<SkeletonShape w="72" h="16" />
					</Column>
				</Box>
			</Row>
			<!-- <Box w="100%" pt="20" pb="20" pr="20" pl="20"
				style="background-image: url(https://cdn.pixabay.com/photo/2024/05/26/15/27/anime-8788959_1280.jpg);">
				<Row gap="12" nowrap>
					<SkeletonShape circle w="48" delay-index="0" />
					<SkeletonShape avatar w="48" delay-index="1" />
					<SkeletonShape w="200" h="120" r="8" delay-index="2" />
				</Row>
			</Box> -->
		</Column>
	</Container>
</template>

<script setup>
const color = useColor()
</script>

<style lang="scss"></style>

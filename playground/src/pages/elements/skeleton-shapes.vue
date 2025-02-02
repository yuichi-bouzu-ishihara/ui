<template>
	<Container>
		<Column gap="12">
			<Box w="100%" pt="20" pb="20" pr="20" pl="20">
				<Row gap="12" nowrap>
					<SkeletonShape circle w="48" delay="0" animation />
					<SkeletonShape avatar w="48" delay="150" animation />
					<SkeletonShape w="200" h="120" delay="300" animation />
				</Row>
			</Box>
			<Box w="100%" pt="20" pb="20" pr="20" pl="20"
				style="background-image: url(https://cdn.pixabay.com/photo/2024/05/26/15/27/anime-8788959_1280.jpg);">
				<Row gap="12" nowrap>
					<SkeletonShape circle w="48" delay="0" />
					<SkeletonShape avatar w="48" delay="150" />
					<SkeletonShape w="200" h="120" delay="300" />
				</Row>
			</Box>
		</Column>
	</Container>
</template>

<script setup>
</script>

<style lang="scss"></style>

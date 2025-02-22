<template>
	<Box class="pageElementsCarousel" w="100vw" pl="40" pr="40">
		<Carousel v-model:index="i" :list="list" />
	</Box>
</template>

<script setup lang="ts">
const i = ref(0)
const list = [
	{
		src: 'https://placehold.jp/24/f0f0f0/cccccc/1000x300.png?text=no%20image%201',
		alt: 'no image 1',
	},
	{
		src: 'https://placehold.jp/24/f0f0f0/cccccc/1000x300.png?text=no%20image%202',
		alt: 'no image 2',
	},
	{
		src: 'https://placehold.jp/24/f0f0f0/cccccc/1000x300.png?text=no%20image%203',
		alt: 'no image 3',
	},
]
</script>

<style lang="scss"></style>

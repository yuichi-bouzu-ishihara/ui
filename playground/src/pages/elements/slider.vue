<template>
	<Box class="pageElementsSlider" w="100vw" pl="40" pr="40">
		<Slider v-bind="{ beforeSpace, afterSpace, centered }" navigation>
			<Row gap="12" nowrap>
				<Box v-for="(i, index) in list" :key="`pageElementsSlider-item-${index}`" w="200">
					<Image :src="`https://placehold.jp/24/f0f0f0/cccccc/512x512.png?text=no%20image%20${index}`" />
				</Box>
			</Row>
		</Slider>
	</Box>
</template>

<script setup>
const beforeSpace = 0
const afterSpace = 0
const centered = true
const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
</script>

<style lang="scss"></style>

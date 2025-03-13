<template>
	<Box class="pageElementsSlider" w="100vw" pl="40" pr="40">
		<Slider v-bind="{ beforeSpace, afterSpace, centered }" :navigation="baseAbove()">
			<Row gap="12" nowrap>
				<Box v-for="(l, index) in list" :key="`pageElementsSlider-item-${index}`" v-bind="box">
					<Center>
						<Typography center body bold color="light">
							{{ l }}
						</Typography>
					</Center>
				</Box>
			</Row>
			<template #prev>
				<IconButton :icon="{ name: 'arrowLeft', size: 16 }" :w="40" :h="40" link rounded :style="{ left: '-40px' }" />
			</template>
			<template #next>
				<IconButton :icon="{ name: 'arrowRight', size: 16 }" :w="40" :h="40" link rounded :style="{ right: '-40px' }" />
			</template>
		</Slider>
	</Box>
</template>

<script setup>
const beforeSpace = 0
const afterSpace = 0
const centered = true
const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const box = { w: '100', h: '100', color: 'dark' }
const { baseAbove } = useBreakPoint()
</script>

<style lang="scss"></style>

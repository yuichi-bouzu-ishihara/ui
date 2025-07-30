<template>
	<Column class="pageDevLayoutMasonry" gap="40">
		<Row justify="stretch" fit-w nowrap>
			<Select v-model="split" :options="splitOptions" name="split" />
			<Input v-model="columnWidth" name="columnWidth" />
		</Row>
		<Masonry v-bind="{ items, columnWidth, split }" :gap="1">
			<template #default="{ item, index, split: sp }">
				<!-- ここに各アイテムのコンテンツを配置 -->
				<Box class="pageDevLayoutsMasonry-item" w="100%" h="100%" relative>
					<Box absolute top="0" left="0" w="100%" h="100%">
						<Image :src="item.image" cover />
					</Box>
					<Center>
						<Typography caption1 bold>
							id: {{ item.id }}, index: {{ index }}, split: {{ sp }}
						</Typography>
					</Center>
				</Box>
			</template>
		</Masonry>
		<Container narrow>
			<Button @click="addItem">
				Add
			</Button>
		</Container>
	</Column>
</template>

<script setup lang="ts">
// Constants ----------
const items = ref([
	{ id: 0, width: 200, height: 200, image: 'https://cdn.pixabay.com/photo/2023/04/30/05/05/anime-characters-7959747_1280.jpg' },
	{ id: 1, width: 200, height: 160, image: 'https://cdn.pixabay.com/photo/2024/05/26/15/27/anime-8788959_1280.jpg' },
	{ id: 2, width: 200, height: 250, image: 'https://cdn.pixabay.com/photo/2023/06/09/16/26/anime-8052171_1280.jpg' },
	{ id: 3, width: 200, height: 150, image: 'https://cdn.pixabay.com/photo/2023/06/02/14/41/ai-generated-8035875_1280.png' },
	{ id: 4, width: 200, height: 300, image: 'https://cdn.pixabay.com/photo/2023/04/27/13/19/ai-generated-7954616_1280.png' },
	{ id: 5, width: 200, height: 200, image: 'https://cdn.pixabay.com/photo/2024/01/22/10/49/ai-generated-8524884_1280.jpg' },
	{ id: 6, width: 200, height: 150, image: 'https://cdn.pixabay.com/photo/2024/07/30/16/52/woman-8932648_1280.jpg' },
	{ id: 7, width: 200, height: 200, image: 'https://cdn.pixabay.com/photo/2024/07/29/17/34/ai-generated-8930250_1280.jpg' },
	{ id: 8, width: 200, height: 300, image: 'https://cdn.pixabay.com/photo/2024/04/28/14/10/woman-8725575_1280.jpg' },
	{ id: 9, width: 200, height: 160, image: 'https://cdn.pixabay.com/photo/2024/01/20/00/42/ai-generated-8520106_1280.jpg' },
])

// Data ----------
const split = ref('0')
const columnWidth = ref('300')
const splitOptions = [
	{ label: '0', value: '0' },
	{ label: '1', value: '1' },
	{ label: '2', value: '2' },
	{ label: '3', value: '3' },
	{ label: '4', value: '4' },
	{ label: '5', value: '5' },
	{ label: '6', value: '6' },
	{ label: '7', value: '7' },
]

// Methods ----------
const addItem = () => {
	items.value.push({ id: items.value.length + 1, height: 200, image: 'https://cdn.pixabay.com/photo/2023/04/30/05/05/anime-characters-7959747_1280.jpg' })
}
</script>

<style lang="scss">
.pageDevLayoutsMasonry {
	&-item {
		width: 100%;
		height: 100%;
		background-color: var(--color-text-010);
		background-size: cover;
	}
}
</style>

<template>
	<Column class="pageDevLayoutMasonry" gap="40">
		<Masonry :items="items" :column-width="300" :gap="1">
			<template #default="{ item, index, split }">
				<!-- ここに各アイテムのコンテンツを配置 -->
				<Box class="pageDevLayoutsMasonry-item"
					:style="{ height: item.height + 'px', backgroundImage: `url(${item.image})` }">
					<Center>
						<Typography caption1 bold>
							id: {{ item.id }}, index: {{ index }}, split: {{ split }}
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
	{ id: 0, height: 200, image: 'https://cdn.pixabay.com/photo/2023/04/30/05/05/anime-characters-7959747_1280.jpg' },
	{ id: 1, height: 160, image: 'https://cdn.pixabay.com/photo/2024/05/26/15/27/anime-8788959_1280.jpg' },
	{ id: 2, height: 250, image: 'https://cdn.pixabay.com/photo/2023/06/09/16/26/anime-8052171_1280.jpg' },
	{ id: 3, height: 150, image: 'https://cdn.pixabay.com/photo/2023/06/02/14/41/ai-generated-8035875_1280.png' },
	{ id: 4, height: 300, image: 'https://cdn.pixabay.com/photo/2023/04/27/13/19/ai-generated-7954616_1280.png' },
	{ id: 5, height: 200, image: 'https://cdn.pixabay.com/photo/2024/01/22/10/49/ai-generated-8524884_1280.jpg' },
	{ id: 6, height: 150, image: 'https://cdn.pixabay.com/photo/2024/07/30/16/52/woman-8932648_1280.jpg' },
	{ id: 7, height: 200, image: 'https://cdn.pixabay.com/photo/2024/07/29/17/34/ai-generated-8930250_1280.jpg' },
	{ id: 8, height: 300, image: 'https://cdn.pixabay.com/photo/2024/04/28/14/10/woman-8725575_1280.jpg' },
	{ id: 9, height: 160, image: 'https://cdn.pixabay.com/photo/2024/01/20/00/42/ai-generated-8520106_1280.jpg' },
])

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

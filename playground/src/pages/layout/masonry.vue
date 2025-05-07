<template>
	<Column class="pageDevLayoutMasonry" gap="40">
		<Masonry :items="items" :column-width="300" :gap="1">
			<template #default="{ item, index }">
				<!-- ここに各アイテムのコンテンツを配置 -->
				<div class="pageDevLayoutsMasonry-item" :style="{ height: item.height + 'px' }">
					<Center>
						<Typography caption1 bold>
							id: {{ item.id }}, index: {{ index }}
						</Typography>
					</Center>
				</div>
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
	{ id: 0, height: 200 },
	{ id: 1, height: 160 },
	{ id: 2, height: 250 },
	{ id: 3, height: 150 },
	{ id: 4, height: 300 },
	{ id: 5, height: 200 },
	{ id: 6, height: 150 },
	{ id: 7, height: 200 },
	{ id: 8, height: 300 },
	{ id: 9, height: 160 },
])

// Methods ----------
const addItem = () => {
	items.value.push({ id: items.value.length + 1, height: 200 })
}
</script>

<style lang="scss">
.pageDevLayoutsMasonry {
	&-item {
		width: 100%;
		height: 100%;
		background-color: var(--color-text-010);
	}
}
</style>

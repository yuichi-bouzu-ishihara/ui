<template>
	<Row v-resize="(rect: DOMRectReadOnly) => width = rect.width" class="masonry" justify="center" fit-w
		:split="columns.length" v-bind="{ gap }">
		<Column v-for="(column, columnIndex) in columns" :key="columnIndex" v-bind="{ gap }">
			<div v-for="(item, itemIndex) in column" :key="itemIndex" class="masonry-item">
				<slot :item="item" :index="getItemIndex(columnIndex, itemIndex)" />
			</div>
		</Column>
	</Row>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from '#imports'

// Types
type Item = {
	id: number
	[key: string]: unknown
}

// Props ----------
const props = defineProps({
	items: { type: Array as () => Item[], required: true },
	columnWidth: { type: Number, default: 300 },
	gap: { type: Number, default: 1 },
})

// Data ----------
const columnCount = ref(0)
const columns = ref<Item[][]>([])
const width = ref(0)

// Methods ----------
const init = () => {
	// コンテナの幅に基づいて列数を計算
	columnCount.value = Math.floor((width.value + props.gap) / (props.columnWidth + props.gap))

	// 列の配列を初期化
	columns.value = Array(columnCount.value).fill(null).map(() => [])

	// 中央の列のインデックスを計算（偶数の場合は左寄り）
	const centerIndex = Math.floor((columnCount.value - 1) / 2)

	// アイテムを中央から順に配置
	props.items.forEach((item, index) => {
		// 行と列の位置を計算
		const col = index % columnCount.value

		// 中央からの相対位置を計算
		const relativePos = Math.ceil(col / 2)

		// 列インデックスを計算（中央から左右交互に）
		const columnIndex = col % 2 === 0
			? centerIndex - relativePos
			: centerIndex + relativePos

		// console.log(index, '->', columnIndex, '(row:', row, 'col:', col, 'relativePos:', relativePos, ')')
		if (columnIndex >= 0 && columnIndex < columnCount.value) {
			columns.value[columnIndex].push(item)
		}
	})
}
const getItemIndex = (columnIndex: number, itemIndex: number) => {
	// 中央の列のインデックスを計算
	const centerIndex = Math.floor((columnCount.value - 1) / 2)

	// 列のオフセットを計算
	const columnOffset = columnIndex - centerIndex

	// 列内の位置から元のインデックスを計算
	if (columnOffset === 0) {
		// 中央の列
		return itemIndex * columnCount.value
	}
	else if (columnOffset > 0) {
		// 中央より右側の列
		return columnOffset * 2 - 1 + itemIndex * columnCount.value
	}
	else {
		// 中央より左側の列
		return -columnOffset * 2 + itemIndex * columnCount.value
	}
}

// Watch ----------
watch(() => props.items, async () => {
	await nextTick()
	init()
}, { deep: true })

watch(() => width.value, async () => {
	await nextTick()
	init()
})

// Lifecycle Hooks ----------
onMounted(async () => {
	await nextTick()
	init()
})
</script>

<style lang="scss">
.masonry {
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>

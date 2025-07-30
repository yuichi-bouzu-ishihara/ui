<template>
	<Row v-resize="(rect: DOMRectReadOnly) => width = rect.width" class="masonry" justify="center" fit-w
		:split="columns.length" v-bind="{ gap }">
		<Column v-for="(column, columnIndex) in columns" :key="`masonry-column-${columnIndex}-update-${updateCount}`"
			v-bind="{ gap }">
			<Ratio v-for="(item, itemIndex) in column" :key="`masonry-item-${itemIndex}`"
				:per="item.height / item.width * 100">
				<slot :item="item" :index="getItemIndex(columnIndex, itemIndex)" :split="columnCount" />
			</Ratio>
		</Column>
	</Row>
</template>

<script setup lang="ts" generic="T extends { id: number; width: number; height: number }">
import { ref, watch, nextTick, onMounted } from '#imports'

// Props ----------
const props = defineProps({
	items: { type: Array as () => T[], required: true },
	columnWidth: { type: [Number, String], default: 300 },
	split: { type: [Number, String], default: 0 }, // 分割数、1以上で columnWidth を無視して分割数で分割する
	gap: { type: Number, default: 1 },
})

// Data ----------
const columnCount = ref(0)
const columns = ref<T[][]>([])
const width = ref(0)
const updateCount = ref(0)

// Methods ----------
const init = () => {
	// 前回の列数を保存
	const prevColumnCount = columnCount.value

	// コンテナの幅に基づいて列数を計算
	if (Number.parseInt(String(props.split)) > 0) {
		columnCount.value = Number.parseInt(String(props.split))
	}
	else {
		columnCount.value = Math.floor((width.value + props.gap) / (Number.parseInt(String(props.columnWidth)) + props.gap))
	}

	// 列数が変わった場合は更新カウントを増やす
	if (prevColumnCount !== columnCount.value) {
		updateCount.value++
	}

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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			columns.value[columnIndex].push(item as any)
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

watch(() => props.split, async () => {
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

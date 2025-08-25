<template>
	<Row v-resize="(rect: DOMRectReadOnly) => width = rect.width" class="masonry" justify="center" fit-w
		:split="columns.length" v-bind="{ gap }">
		<Column v-for="(column, columnIndex) in columns" :key="`masonry-column-${columnIndex}-update-${updateCount}`"
			class="masonry-column" v-bind="{ gap }">
			<Ratio v-for="(item, itemIndex) in column" :key="`masonry-item-${item.id}`" :per="item.height / item.width * 100">
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
const columnHeights = ref<number[]>([])
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

	// 列数が0以下の場合は処理をスキップ
	if (columnCount.value <= 0) {
		columns.value = []
		columnHeights.value = []
		return
	}

	// 列数が変わった場合は更新カウントを増やす
	if (prevColumnCount !== columnCount.value) {
		updateCount.value++
	}

	// 列の配列と高さを初期化
	columns.value = Array(columnCount.value).fill(null).map(() => [])
	columnHeights.value = Array(columnCount.value).fill(0)

	// アイテムを高さに基づいて最適な列に配置
	props.items.forEach((item) => {
		// 最も高さが小さい列のインデックスを見つける
		const shortestColumnIndex = findShortestColumn()

		// 有効なインデックスの場合のみ配置
		if (shortestColumnIndex >= 0 && shortestColumnIndex < columns.value.length) {
			// アイテムを配置
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			columns.value[shortestColumnIndex].push(item as any)

			// 列の高さを更新（アイテムの高さ + gap）
			const itemHeight = (item.height / item.width) * (Number.parseInt(String(props.columnWidth)))
			columnHeights.value[shortestColumnIndex] += itemHeight + props.gap
		}
	})
}

const findShortestColumn = (): number => {
	// 配列が空の場合は0を返す
	if (columnHeights.value.length === 0) {
		return 0
	}

	let shortestIndex = 0
	let shortestHeight = columnHeights.value[0]

	for (let i = 1; i < columnHeights.value.length; i++) {
		if (columnHeights.value[i] < shortestHeight) {
			shortestHeight = columnHeights.value[i]
			shortestIndex = i
		}
	}

	return shortestIndex
}

const getItemIndex = (columnIndex: number, itemIndex: number) => {
	// 列内の位置から元のインデックスを計算
	// 各列のアイテム数を考慮してインデックスを計算
	let globalIndex = 0

	for (let i = 0; i < columnIndex; i++) {
		globalIndex += columns.value[i].length
	}

	return globalIndex + itemIndex
}

// Watch ----------
watch(() => props.items, async () => {
	await nextTick()
	init()
}, { deep: true })

watch(() => width.value, async () => {
	// widthが有効な値の場合のみ初期化
	if (width.value > 0) {
		await nextTick()
		init()
	}
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
$cn: '.masonry';

#{$cn} {
	width: 100%;
	display: flex;
	justify-content: center;

	&-column {
		&:empty {
			display: none;
		}
	}
}
</style>

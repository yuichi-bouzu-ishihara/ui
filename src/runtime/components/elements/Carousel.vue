<template>
	<div ref="element" class="carousel">
		<div v-for="(item, i) in list" :key="`carousel-item-${i}`" class="carousel-item">
			<Image v-bind="item" cover />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import Image from './Image.vue'

type ListItem = {
	src: string
	alt: string
}

// Props ------------------
const props = defineProps({
	index: { type: Number, default: 0 },
	list: { type: Array as () => ListItem[], default: () => [] },
})

// Emits ------------------
const emit = defineEmits({
	change: (_index: number) => true,
})

// Data ------------------
const element = ref<HTMLElement | null>(null)
const activeIndex = ref(props.index)
let scrollTimeout: NodeJS.Timeout | null = null

// Methods ------------------
const updateIndexOnScroll = () => {
	if (element.value) {
		const scrollLeft = element.value.scrollLeft
		const itemWidth = element.value.clientWidth
		const nextIndex = Math.round(scrollLeft / itemWidth)
		if (activeIndex.value !== nextIndex) {
			// console.log('updateIndexOnScroll', nextIndex)
			activeIndex.value = nextIndex
		}

		// スクロールが止まったときに emit する
		if (scrollTimeout) {
			clearTimeout(scrollTimeout)
		}
		scrollTimeout = setTimeout(() => {
			emit('change', activeIndex.value)
		}, 150) // 150ms 後にスクロールが止まったと判断
	}
}
const setIndex = (nv: number) => {
	if (element.value) {
		const items = element.value.children
		if (items[nv]) {
			items[nv].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
		}
	}
}

// Watch ------------------
watch(
	() => props.index,
	(nv) => {
		if (nv !== undefined) {
			setIndex(nv)
		}
	},
)

// Lifecycle Hooks ------------------
onMounted(async () => {
	await nextTick()
	if (element.value) {
		element.value.addEventListener('scroll', updateIndexOnScroll)
	}
})
onUnmounted(() => {
	if (element.value) {
		element.value.removeEventListener('scroll', updateIndexOnScroll)
	}
})
</script>

<style lang="scss" scoped>
.carousel {
	display: flex;
	width: 100%;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}

	&-item {
		flex: 0 0 100%;
		scroll-snap-align: center; // スクロール位置を中央に合わせる
		scroll-snap-stop: always; // 一つづつスクロールする
		width: 100%;
	}
}
</style>

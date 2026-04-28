<template>
	<Box class="pageElementsCarousel" w="100vw" pl="40" pr="40">
		<h3>Controls</h3>
		<Box :style="{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }">
			<label><input v-model="centered" type="checkbox"> centered</label>
			<label><input v-model="loop" type="checkbox"> loop</label>
			<button type="button" @click="prev">
				prev
			</button>
			<button type="button" @click="next">
				next
			</button>
			<span>index: {{ i }} / {{ list.length - 1 }}</span>
		</Box>

		<h3>Default slot — uniform width (60% of viewport)</h3>
		<Carousel v-model:index="i" :centered="centered" :loop="loop" class="demo">
			<div v-for="item in list" :key="item.alt" class="demo-slide">
				<img :src="item.src" :alt="item.alt">
			</div>
		</Carousel>

		<h3>Uneven widths — verifies non-uniform slide handling</h3>
		<Carousel v-model:index="j" :centered="centered" :loop="loop" class="demo demo-uneven">
			<div v-for="(w, k) in unevenWidths" :key="k" class="demo-slide" :style="{ flexBasis: w }">
				<Box w="100%" h="100%" r="12" color="primary" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }">
					{{ k + 1 }} ({{ w }})
				</Box>
			</div>
		</Carousel>
		<Box>uneven index: {{ j }}</Box>
	</Box>
</template>

<script setup lang="ts">
const centered = ref(false)
const loop = ref(false)

const i = ref(0)
const j = ref(0)

const list = [
	{ src: 'https://placehold.jp/24/f0f0f0/cccccc/1000x300.png?text=no%20image%201', alt: 'no image 1' },
	{ src: 'https://placehold.jp/24/f0f0f0/cccccc/1000x300.png?text=no%20image%202', alt: 'no image 2' },
	{ src: 'https://placehold.jp/24/f0f0f0/cccccc/1000x300.png?text=no%20image%203', alt: 'no image 3' },
	{ src: 'https://placehold.jp/24/f0f0f0/cccccc/1000x300.png?text=no%20image%204', alt: 'no image 4' },
]

const unevenWidths = ['240px', '360px', '180px', '480px', '300px']

const prev = () => {
	i.value = loop.value ? (i.value - 1 + list.length) % list.length : Math.max(0, i.value - 1)
}
const next = () => {
	i.value = loop.value ? (i.value + 1) % list.length : Math.min(list.length - 1, i.value + 1)
}
</script>

<style lang="scss">
.pageElementsCarousel {
	display: flex;
	flex-direction: column;
	gap: 24px;
	padding-top: 24px;
	padding-bottom: 80px;

	h3 {
		font-size: 14px;
		font-weight: 600;
		opacity: 0.5;
	}

	.demo {
		// Carousel は親レイアウトを尊重する。スライド幅もここで指定する。
		.demo-slide {
			flex: 0 0 60%;
			padding-right: 16px;

			img {
				display: block;
				width: 100%;
				height: auto;
				border-radius: 12px;
			}
		}

		&.demo-uneven .demo-slide {
			flex-basis: auto;
			height: 120px;
			padding-right: 16px;
		}
	}
}
</style>

<template>
	<div ref="emblaRef" class="carousel">
		<div class="carousel-track">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaOptionsType } from 'embla-carousel'

// スロットの直下要素が 1 スライドにマッピングされる。
// 子は単一ルート要素であること（<template v-for> によるフラグメントは不可）。

// Models ------------------
const index = defineModel<number>('index', { default: 0 })

// Props ------------------
type Props = {
	/** アクティブスライドを中央揃えにする */
	centered?: boolean
	/** 末尾⇄先頭をループさせる */
	loop?: boolean
}
const props = withDefaults(defineProps<Props>(), {
	centered: false,
	loop: false,
})

// Embla ------------------
const options = computed<EmblaOptionsType>(() => ({
	axis: 'x',
	align: props.centered ? 'center' : 'start',
	loop: props.loop,
	startIndex: index.value,
	skipSnaps: false,
}))

const [emblaRef, emblaApi] = emblaCarouselVue(options)

// Methods ------------------
const syncIndexFromEmbla = () => {
	const next = emblaApi.value?.selectedScrollSnap()
	if (next != null && next !== index.value) {
		index.value = next
	}
}

// Watch ------------------
watch(
	() => index.value,
	(i) => {
		if (i == null || !emblaApi.value) return
		if (emblaApi.value.selectedScrollSnap() !== i) {
			emblaApi.value.scrollTo(i)
		}
	},
)

// Lifecycle Hooks ------------------
onMounted(() => {
	emblaApi.value?.on('select', syncIndexFromEmbla)
})
</script>

<style lang="scss">
.carousel {
	position: relative;
	width: 100%;
	overflow: hidden;

	&-track {
		display: flex;
		// Embla 必須: スライドは flex 不縮なブロック。
		// 幅・余白は親が CSS で決める（ハードコードしない）。
		> * {
			flex: 0 0 auto;
			min-width: 0;
		}
	}
}
</style>

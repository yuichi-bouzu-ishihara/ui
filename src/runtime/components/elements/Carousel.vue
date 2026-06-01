<template>
	<div ref="emblaRef" class="carousel">
		<div class="carousel-track">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
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
// 初期化用の options。reactive な ref を渡すと embla-carousel-vue が
// options 変更ごとに reInit() を呼び、scrollTo のアニメーションが
// 即時ジャンプで上書きされてしまう。プレーンオブジェクトで渡し、
// 設定変更（centered / loop）は下の watch で手動 reInit する。
const initialOptions: EmblaOptionsType = {
	axis: 'x',
	align: props.centered ? 'center' : 'start',
	loop: props.loop,
	startIndex: index.value,
	skipSnaps: false,
}

const [emblaRef, emblaApi] = emblaCarouselVue(initialOptions)

// Methods ------------------
const syncIndexFromEmbla = () => {
	const next = emblaApi.value?.selectedScrollSnap()
	if (next != null && next !== index.value) {
		index.value = next
	}
}

// Watch ------------------
// v-model:index → Embla（アニメーションあり）
watch(
	() => index.value,
	(i) => {
		if (i == null || !emblaApi.value) return
		if (emblaApi.value.selectedScrollSnap() !== i) {
			emblaApi.value.scrollTo(i)
		}
	},
)

// centered / loop の変更時のみ reInit。現在位置を保ったまま再構築する。
watch(
	() => [props.centered, props.loop] as const,
	([centered, loop]) => {
		if (!emblaApi.value) return
		emblaApi.value.reInit({
			axis: 'x',
			align: centered ? 'center' : 'start',
			loop,
			startIndex: emblaApi.value.selectedScrollSnap(),
			skipSnaps: false,
		})
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

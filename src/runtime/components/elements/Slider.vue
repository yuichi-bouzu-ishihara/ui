<template>
	<Box v-resize="(rect: DOMRectReadOnly) => width = rect.width" class="slider"
		:w="navigation ? `calc(100% - ${leftSpace} - ${rightSpace})` : '100%'" :ml="navigation ? leftSpace : 0"
		:mr="navigation ? rightSpace : 0" relative>
		<div ref="innerEl" class="slider-inner">
			<Box v-resize="(rect: DOMRectReadOnly) => slotWidth = rect.width" :ml="centered ? 'auto' : ''"
				:mr="centered ? 'auto' : ''">
				<div :style="innerStyles">
					<slot />
				</div>
			</Box>
		</div>
		<template v-if="navigation">
			<template v-if="isShowPrev">
				<Box class="slider-prev" @click="prev">
					<slot name="prev" />
				</Box>
			</template>
			<template v-if="isShowNext">
				<Box class="slider-next" @click="next">
					<slot name="next" />
				</Box>
			</template>
		</template>
	</Box>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useCss } from '../../composables/css'
import Box from '../layout/Box.vue'

// Props ------------------
const props = defineProps({
	leftSpace: { type: String, default: '0' }, // 左側にスペースを追加する
	rightSpace: { type: String, default: '0' }, // 右側にスペースを追加する
	beforeSpace: { type: [Number, String], default: 0 }, // 最初の要素の前にスペースを追加する
	afterSpace: { type: [Number, String], default: 0 }, // 最後の要素の後にスペースを追加する
	navigation: { type: Boolean, default: false }, // 左右のナビゲーションを表示する
	centered: { type: Boolean, default: false }, // スロットを中央揃えにする
})

// Emits ------------------
const emit = defineEmits([
	'real-in',
	'reach-start',
	'reach-end',
	'exceeds-slot', // スロットがスライダー幅を超えている
	'within-slot', // スロットがスライダー幅内に収まっている
])

// Data -------------------
const width = ref(0)
const innerEl = ref<HTMLElement | null>(null)
const nextScrollLeft = ref(0) // 次のスクロール位置
const scrollLeft = ref(0) // 現在のスクロール位置
const slotWidth = ref(0) // スロットの幅

// Computed ------------------
const innerStyles = computed(() => {
	const before = Number(props.beforeSpace)
	const after = Number(props.afterSpace)
	const leftStyle = before > 0 ? 'paddingLeft' : 'marginLeft'
	const rightStyle = after > 0 ? 'paddingRight' : 'marginRight'
	return {
		[leftStyle]: `${useCss().getSize(before)}`,
		[rightStyle]: `${useCss().getSize(after)}`,
	}
})
const isShowPrev = computed(() => {
	return scrollLeft.value > 0
})
const isShowNext = computed(() => {
	return scrollLeft.value < slotWidth.value - width.value
})

// Methods ------------------
const handleScroll = () => {
	if (innerEl.value) {
		scrollLeft.value = innerEl.value.scrollLeft
	}
}
const prev = () => {
	nextScrollLeft.value -= width.value
}
const next = () => {
	nextScrollLeft.value += width.value
}

// Watchers ------------------
watch(
	() => nextScrollLeft.value,
	(nv) => {
		if (innerEl.value) {
			innerEl.value.scrollLeft = nv
		}
	},
	{ immediate: true },
)
watch(
	() => scrollLeft.value,
	(nv) => {
		if (nv === 0) {
			emit('reach-start')
		}
		else if (nv === slotWidth.value - width.value) {
			emit('reach-end')
		}
		else {
			emit('real-in')
		}
	},
	{ immediate: true },
)
watch(
	() => [width.value, slotWidth.value],
	([newWidth, newSlotWidth]) => {
		if (newWidth === 0 || newSlotWidth === 0) {
			return
		}
		if (newWidth < newSlotWidth) {
			emit('exceeds-slot')
		}
		else {
			emit('within-slot')
		}
	},
	{ immediate: true },
)

// Lifecycle Hooks ------------------
// コンポーネントがマウントされたときにイベントリスナーを追加
onMounted(async () => {
	await nextTick()
	if (innerEl.value) {
		innerEl.value.addEventListener('scroll', handleScroll)
	}
})

// コンポーネントがアンマウントされる前にイベントリスナーを削除
onUnmounted(() => {
	if (innerEl.value) {
		innerEl.value.removeEventListener('scroll', handleScroll)
	}
})
</script>

<style lang="scss">
$cn: '.slider'; // コンポーネントセレクタ名

#{$cn} {
	&-inner {
		display: flex;
		overflow-x: auto; // トラックパッドでどうも同様に動作させる。
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		/* スクロールを滑らかにする */
		-webkit-overflow-scrolling: touch;

		// スクロールバー非表示
		-ms-overflow-style: none;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	&-prev {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(calc(-50%));
	}

	&-next {
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
	}
}
</style>

<template>
	<div ref="el" class="scroll" :class="classes" @click="handleClick">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Props ------------------
const props = defineProps({
	disabled: { type: Boolean, default: false }, // スクロール不可
	noBar: { type: Boolean, default: false }, // スクロールバー非表示
})

// Data ---------------------------------------------------------
const el = ref<HTMLElement | null>(null)
let scrollTimer: ReturnType<typeof setTimeout> | null = null
const lastScrollTop = ref(0)
const scrolling = ref(false) // Add a new flag to track if it's currently scrolling

// Emit ---------------------------------------------------------
const EMIT_START = 'start'
const EMIT_END = 'end'
const EMIT_SCROLL = 'scroll'
const EMIT_CLICK_OUTSIDE = 'click-outside' // slot エレメント以外がクリックされた
const emit = defineEmits([EMIT_START, EMIT_END, EMIT_SCROLL, EMIT_CLICK_OUTSIDE])

// Methods ------------------------------------------------------
const handleScroll = () => {
	const currentScrollTop = el.value?.scrollTop

	if (lastScrollTop.value === currentScrollTop) return

	if (!scrolling.value) {
		emit(EMIT_START)
		scrolling.value = true
	}

	if (scrollTimer !== null) {
		clearTimeout(scrollTimer)
	}

	scrollTimer = setTimeout(() => {
		emit(EMIT_END)
		scrolling.value = false
	}, 100)

	if (currentScrollTop !== undefined) {
		lastScrollTop.value = currentScrollTop
		emit(EMIT_SCROLL, currentScrollTop)
	}
}

const handleClick = (event: MouseEvent) => {
	if (event.target === el.value) {
		emit(EMIT_CLICK_OUTSIDE)
	}
}

// Computed --------------------------------------------------------
const classes = computed(() => {
	return {
		_nobar: props.noBar,
		_enabled: !props.disabled,
	}
})

// Lifecycle Hooks -----------------------------------------------
onMounted(() => {
	el.value?.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
	el.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss">
.scroll {
	width: 100%;
	height: 100%;

	// スクロールチェーンを回避する
	overscroll-behavior-y: contain;

	&._enabled {
		overflow-y: scroll;
	}

	// スクロールバーを非表示
	&._nobar {
		-ms-overflow-style: none;
		/* IE and Edge */
		scrollbar-width: none;
		/* Firefox */

		&::-webkit-scrollbar {
			display: none;
		}
	}
}
</style>

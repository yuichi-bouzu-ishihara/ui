<template>
	<div class="image" :class="classes">
		<img v-if="isMounted" ref="element" class="image-inner" v-bind="{ src, alt }" @load="loaded" @error="error">
	</div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, watchEffect, onMounted } from 'vue'

// Props ---------------------
const props = defineProps({
	src: { type: String, default: '' }, // 画像パス
	alt: { type: String, default: '' }, // 代替テキスト
	// lazy: { type: Boolean, default: true }, // 画像の読み込みを遅らせるかどうか。 Observer を使用して実装した方がいいかも。
	loader: { type: Boolean, default: true }, // 読み込み中表示をするかどうか
	background: { type: Boolean, default: true }, // 背景を塗るかどうか
	userDrag: { type: Boolean, default: true }, // ドラッグを許可するかどうか
	cover: { type: Boolean, default: false }, // 画像の表示方法
	contain: { type: Boolean, default: false }, // 画像を縮小して表示するかどうか
	fadeIn: { type: Boolean, default: true }, // フェードイン
})
// Extracting the src from props
const { src } = toRefs(props)

// Emits ---------------------
const emit = defineEmits(['ready', 'loaded', 'error'])

// Data ----------------------
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const isError = ref(false)
const isLoaded = ref(false)
const isMounted = ref(false)
const element = ref<HTMLImageElement | null>(null)

// Computed ------------------
const classes = computed(() => {
	return {
		_background: props.background,
		_loaded: isLoaded.value,
		_fadeIn: props.fadeIn,
		_noUserDrag: !props.userDrag,
		_cover: props.cover,
		_contain: props.contain,
	}
})

// Watch ---------------------
watchEffect(() => {
	if (naturalWidth.value > 0) {
		const width = element.value ? element.value.clientWidth : 0
		const height = element.value ? element.value.clientHeight : 0

		emit('ready', {
			naturalWidth: naturalWidth.value,
			naturalHeight: naturalHeight.value,
			width: width * 2,
			height: height * 2,
		})
	}
})

// Methods -------------------
const loaded = () => {
	if (element.value === null) return
	naturalWidth.value = element.value.naturalWidth
	naturalHeight.value = element.value.naturalHeight
	isLoaded.value = true
	emit('loaded')
}
const error = () => {
	isError.value = true
	emit('error')
}

// Lifecycle Hooks -----------
onMounted(() => {
	isMounted.value = true
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.image'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		&-inner {
			display: block;
			width: 100%;
			height: 100%;
			opacity: 0;
		}

		// 背景を塗る
		&._background {
			background-color: var(--color-text-005);
		}

		// ドラッグ禁止
		&._noUserDrag {
			#{$cn}-inner {
				// user-drag: none;
				-webkit-user-drag: none;
				-moz-user-select: none;
				user-select: none;
			}
		}

		&._cover {
			width: 100%;
			height: 100%;

			#{$cn}-inner {
				object-fit: cover;
			}
		}

		&._contain {
			width: 100%;
			height: 100%;

			#{$cn}-inner {
				object-fit: contain;
			}
		}

		&._loaded {
			#{$cn}-inner {
				opacity: 1;
			}
		}

		&._fadeIn {
			#{$cn}-inner {
				transition: var.$transition-base;
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

<!--
	Avatar
	プロフィール画像を表示するコンポーネント。
	以前は Face というコンポーネント名にしていた。
 -->
<template>
	<Box v-intersect.once="{ rootMargin: '0px 0px 200px 0px' }" class="avatar" v-bind="{ ...styles }"
		@intersect="isIntersect = true">
		<div class="avatar-inner">
			<template v-if="isIntersect">
				<Image class="avatar-inner-img" :class="{ _show: isLoaded }" alt="" :src="path" cover @loaded="loaded"
					@error="error" />
			</template>
			<template v-if="!isIntersect || !isLoaded">
				<SkeletonShape class="avatar-inner-loader" avatar w="100%" h="100%" :animation="isIntersect" />
			</template>
		</div>
		<template v-if="border">
			<div :class="`avatar-border _${color}`" :style="borderStyles" />
		</template>
	</Box>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Box from '../layout/Box.vue'
import { useCss } from '../../composables/css'
import { useAvatar } from '../../composables/elements/avatar'
import SkeletonShape from '../elements/SkeletonShape.vue'
import Image from './Image.vue'

// Composables -------------------------------------
const { getSize } = useCss() // css に関する関数
const { config: avatarConfig } = useAvatar()

// Props --------------------------------------------------------
const props = defineProps({
	size: { type: [Number, String], default: '16' }, // 表示サイズ。設定しやすいように、数値も文字列も両方受け付ける。
	src: { type: String, default: '' }, // 画像パス
	border: { type: [Number, String], default: 0 }, // 指定した数値の px で外枠に線をつける。
	borderColor: { type: String, default: 'background' }, // 線の色
})

// Emit ---------------------------------------------------------
const emit = defineEmits(['ready', 'error'])

// Data の定義
const isLoaded = ref<boolean>(false) // フェイス画像がロードされたかどうか
const isIntersect = ref<boolean>(false) // 画面内に表示されているかどうか

// Computed -----------------------------------------------------
const path = computed(() => {
	let newPath = props.src
	if (newPath) {
		if (!newPath.includes('https://') && !newPath.includes('http://')) {
			if (!newPath.startsWith('data:image')) {
				if (!newPath.includes('/_nuxt/')) {
					if (avatarConfig.value?.urlPrefix) {
						newPath = `${avatarConfig.value.urlPrefix}${newPath}`
					}
				}
			}
		}
	}
	return newPath
})
// 線のスタイル
const borderStyles = computed(() => {
	// 線のエレメント用スタイルオブジェクト
	let obj = {}
	const borderWidth = Number(props.border) // 数値にする
	// 線の設定があった時
	if (borderWidth > 0) {
		// 線を表示するエレメントのスタイルを設定する。
		const top = getSize(-borderWidth)
		const left = getSize(-borderWidth)
		const width = `calc(100% + ${getSize(borderWidth * 2)})`
		const height = `calc(100% + ${getSize(borderWidth * 2)})`
		obj = {
			top,
			left,
			width,
			height,
		}
	}
	return obj
})
// 線の色
const color = computed(() => {
	const str = props.borderColor
	return str
})
// スタイル生成
const styles = computed(() => {
	const size: number = Number(props.size)
	return { w: size, minW: size, maxW: size, h: size, minH: size, maxH: size }
})

// Methods ------------------------------------------------------
// フェイス画像がロードされた時
const loaded = () => {
	isLoaded.value = true
	emit('ready')
}
const error = () => {
	emit('error')
}
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.avatar'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {

	@if $mode =='base' {
		position: relative;
		z-index: 0;

		&-inner {
			width: 100%;
			height: 100%;
			mask-image: var(--avatar-mask-src);
			mask-size: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: var(--color-dark-005);
			user-select: none; // 選択できないようにする

			&-img {
				opacity: 0;

				&._show {
					opacity: 1;
				}
			}

			&-loader {
				position: absolute;
				inset: 0;
			}
		}

		&-border {
			position: absolute;
			z-index: -1;
			mask-image: var(--avatar-mask-src);
			mask-size: 100%;

			// Color
			@each $priority in var.$color-priorities {
				@each $tint in var.$color-tint {
					&._#{$priority}#{$tint} {
						@include mix.color-var($priority, $tint) using ($css-var) {
							background-color: $css-var;
						}
					}
				}
			}
		}
	}

	@if $mode =='darkmode' {
		&-inner {
			background-color: var(--color-light-005);
		}
	}

	@if $mode =='auto' {}
}
</style>

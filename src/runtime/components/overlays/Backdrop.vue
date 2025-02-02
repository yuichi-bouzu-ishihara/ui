<template>
	<div :class="classes" :style="{ zIndex }" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// Props --------------------------------
const props = defineProps({
	blur: { type: Boolean, default: false },
	// 薄さ加減タイプ
	ultraSoft: { type: Boolean, default: false }, // 薄い
	soft: { type: Boolean, default: false },
	medium: { type: Boolean, default: false },
	hard: { type: Boolean, default: false },
	solid: { type: Boolean, default: false },
	absolute: { type: Boolean, default: false },
	zIndex: { type: [Number, String], default: -1 },
})

// Data --------------------------------
const tint = ref<string>('')

// Watch ------------------------------
// 薄さ加減を監視する
watch(
	[() => props.ultraSoft, () => props.soft, () => props.medium, () => props.hard, () => props.solid],
	([ultraSoft, soft, medium, hard, solid], []) => {
		// 優先度を文字列で type に設定する。
		if (ultraSoft) tint.value = 'ultraSoft'
		if (soft) tint.value = 'soft'
		if (medium) tint.value = 'medium'
		if (hard) tint.value = 'hard'
		if (solid) tint.value = 'solid'
		// medium を設定する。
		if (!tint.value) {
			tint.value = 'medium'
		}
	},
	{ immediate: true }, // props の初期値を監視するために immediate を true にする。
)

// Computed ------------------------------
const classes = computed(() => {
	const obj: {
		backdrop: boolean
		[key: string]: boolean
	} = {
		backdrop: true,
		_blur: props.blur,
		_absolute: props.absolute,
		[`_${tint.value}`]: true,
	}
	return obj
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;

.backdrop {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;

	&._blur {
		backdrop-filter: blur(12px);
		background-color: rgba(black, 0.85);
	}

	&._ultraSoft {
		background-color: rgba(black, 0.15);
	}

	&._soft {
		background-color: rgba(black, 0.3);
	}

	&._medium {
		background-color: rgba(black, 0.6);
	}

	&._hard {
		background-color: rgba(black, 0.8);
	}

	&._solid {
		background-color: var(--color-darkblack);
	}

	&._absolute {
		position: absolute;
	}
}
</style>

<template>
	<div class="aspectRatio" :class="classes" :style="value ? `aspect-ratio: ${value}` : ''">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props ------------------
const props = defineProps({
	golden: { type: Boolean, default: false }, // 黄金比
	square: { type: Boolean, default: false }, // 正方形
	wideScreen: { type: Boolean, default: false }, // 16:9
	cinema: { type: Boolean, default: false }, // シネマスコープ 2.35:1
	ultraWideGaming: { type: Boolean, default: false }, // ウルトラワイドゲーミング 32:9
	value: { type: String, default: '' }, // 直接指定 16 / 9 など
	// 用紙サイズ（ISO 216 A/B 系）。基本は landscape（横長）で扱う。
	paper: { type: Boolean, default: false },
	// 縦向き（portrait）指定。true の場合、各比率を縦向きで適用。
	portrait: { type: Boolean, default: false },
})

// Data ------------------
const ratio = ref<string>('')

// Watch ---------------------------
watch(
	[() => props.golden, () => props.square, () => props.wideScreen, () => props.cinema, () => props.ultraWideGaming, () => props.paper],
	([newGolden, newSquare, newWideScreen, newCinema, newUltraWideGaming, newPaper]) => {
		// 優先度を文字列で type に設定する。
		if (newGolden) ratio.value = 'golden'
		if (newSquare) ratio.value = 'square'
		if (newWideScreen) ratio.value = 'wideScreen'
		if (newCinema) ratio.value = 'cinema'
		if (newUltraWideGaming) ratio.value = 'ultraWideGaming'
		// ISO 用紙（A/B 系）は全て √2 のアスペクト比。要求により基本は landscape（横長）。
		if (newPaper) ratio.value = 'paper'
		// 設定されていない場合は、 golden を設定する。
		if (!ratio.value && !props.value) {
			ratio.value = 'golden'
		}
	},
	{ immediate: true }, // props の初期値を監視するために immediate を true にする。
)

// Computed ---------------------------
const classes = computed(() => {
	return {
		[`_${ratio.value}`]: true,
		_portrait: props.portrait,
	}
})
</script>

<style lang="scss">
$cn: '.aspectRatio'; // コンポーネントクラス名

#{$cn} {
	width: 100%;
	max-width: 100%;
	max-height: 100%;

	&._golden {
		aspect-ratio: 1.618 / 1;

		&._portrait {
			aspect-ratio: 1 / 1.618;
		}
	}

	&._square {
		aspect-ratio: 1 / 1;

		&._portrait {
			aspect-ratio: 1 / 1;
		}
	}

	&._wideScreen {
		aspect-ratio: 16 / 9;

		&._portrait {
			aspect-ratio: 9 / 16;
		}
	}

	&._cinema {
		aspect-ratio: 2.35 / 1;

		&._portrait {
			aspect-ratio: 1 / 2.35;
		}
	}

	&._ultraWideGaming {
		aspect-ratio: 32 / 9;

		&._portrait {
			aspect-ratio: 9 / 32;
		}
	}

	&._paper {
		aspect-ratio: 1.414 / 1;

		&._portrait {
			aspect-ratio: 1 / 1.414;
		}
	}
}
</style>

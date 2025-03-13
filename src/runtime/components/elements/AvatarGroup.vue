<template>
	<Box class="avatarGroup" :class="classes" :style="{ '--base-box-size': BASE_BOX_SIZE }" :w="size" :min-w="size"
		:h="size" :min-h="size" z-index="0">
		<Avatar v-for="(p, i) in list.slice(0, MAX_USER_NUM)" :key="`avatarGroup-item-${i}`" class="avatarGroup-item"
			:class="`_index${i}`" :src="p" :size="avatarSize(i)" v-bind="{ border, borderColor }" />
	</Box>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Box from '../layout/Box.vue'
import Avatar from './Avatar.vue'

// Constants ------------------
const MAX_USER_NUM = 4 // 最大表示人数
const BASE_BOX_SIZE = 128 // Box 基準サイズ。 デザインでは Large。
const BASE_AVATAR_SIZE = BASE_BOX_SIZE // Box 128px における Avatar 1つ分のサイズ

// Props ------------------
const props = defineProps({
	list: { type: Array as () => string[], default: () => [] },
	size: { type: [Number, String], default: 92 }, // サイズ指定
	border: { type: [Number, String], default: 3 },
	borderColor: { type: String, default: 'background' }, // 線の色
})

// Computed ------------------
const classes = computed(() => {
	return {
		[`_num${props.list.length}`]: true,
	}
})
const avatarSize = computed(() => (index: number) => {
	// デフォルトはアバター一つのサイズ。
	let num: number = BASE_AVATAR_SIZE
	if (props.list.length > 1) {
		switch (index) {
			case 0: // 左上の一番大きい Avatar
				num = 82
				break
			case 1: // 右中央の二番目に大きい Avatar
				num = 70
				break
			case 2: // 左下の三番目に大きい Avatar
				num = 44
				break
			case 3: // 右上の四番目に大きい Avatar
				num = 34
				break
		}
	}

	num = num * (Number(props.size) / BASE_BOX_SIZE)

	return num
})
</script>

<style lang="scss">
$cn: '.avatarGroup'; // コンポーネントクラス名

$base-box-size: var(--base-box-size);

#{$cn} {
	position: relative;

	#{$cn}-item {
		position: absolute;
	}

	&._num1 {
		#{$cn}-item {
			inset: 0;
			margin: auto;
		}
	}

	&:not(._num1) {
		#{$cn}-item {
			&._index0 {
				top: calc(6 / $base-box-size * 100%);
				left: 0;
				z-index: 1;
			}

			&._index1 {
				top: calc(38 / $base-box-size * 100%);
				right: 0;
				z-index: 3;
			}

			&._index2 {
				top: calc(79 / $base-box-size * 100%);
				left: calc(28 / $base-box-size * 100%);
				z-index: 2;
			}

			&._index3 {
				top: calc(8 / $base-box-size * 100%);
				left: calc(76 / $base-box-size * 100%);
				z-index: 0;
			}
		}
	}
}
</style>

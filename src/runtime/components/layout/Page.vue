<template>
	<Box class="page" :inner-center="center" :h="height" :pt="topSpace" :pb="bottomSpace">
		<Box v-resize="(rect: DOMRectReadOnly) => contentHeight = rect.height" w="100%">
			<slot />
		</Box>
	</Box>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useViewport } from '../../composables/viewport'

// Props ------------------------------------------------------
const props = defineProps({
	center: { type: Boolean, default: false }, // コンテンツを中央に配置するかどうか
	topSpace: { type: [Number, String], default: 0 }, // 上部のスペース
	bottomSpace: { type: [Number, String], default: 0 }, // 下部のスペース
})

// Data ------------------------------------------------------
const contentHeight = ref(0)

// Computed ------------------------------------------------------
const height = computed(() => {
	if (useViewport().height.value > (contentHeight.value + Number(props.topSpace) + Number(props.bottomSpace))) {
		return '100vh'
	}
	else {
		return 'auto'
	}
})
</script>

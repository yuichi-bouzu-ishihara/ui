<script setup lang="ts">
import { computed, ref } from 'vue'
import { useViewport } from '../../composables/viewport'
import Center from './Center.vue'

// Props ------------------------------------------------------
const props = defineProps({
	center: { type: Boolean, default: true }, // コンテンツを中央に配置するかどうか
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

<template>
	<Box class="page" :h="height" :pt="topSpace" :pb="bottomSpace">
		<component :is="props.center ? Center : 'div'">
			<Box v-resize="(rect: DOMRectReadOnly) => contentHeight = rect.height">
				<slot />
			</Box>
		</component>
	</Box>
</template>

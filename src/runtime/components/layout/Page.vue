<template>
	<Box class="page" :class="{ _center: center }" :h="height" :pt="topSpace" :pb="bottomSpace">
		<Box v-resize="(rect: DOMRectReadOnly) => contentHeight = rect.height" class="page-inner">
			<slot />
		</Box>
	</Box>
</template>

<script setup lang="ts">
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

<style lang="scss">
.page {
	&._center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.page-inner {
		width: 100%;
	}
}
</style>

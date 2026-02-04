<template>
	<div class="app">
		<NuxtLayout :style="{ opacity: pending ? 0 : 1 }">
			<NuxtPage />
		</NuxtLayout>
		<Box v-if="pending" w="100vw" h="100vh" absolute top="0" left="0" color="dark">
			<Center>
				<Spinner />
			</Center>
		</Box>
		<div class="app-layers" style="z-index: 2">
			<DrawerLayer style="z-index: 10">
				<TheDrawerTest v-if="drawer('test')" />
				<TheDrawerDepthTest v-if="drawer('depthTest')" />
			</DrawerLayer>
			<SheetLayer style="z-index: 10">
				<template v-if="sheet.list.value.length">
					<template v-for="(item, index) in sheet.list.value">
						<template v-if="item.component !== ''">
							<component :is="sheetComponents[item.component]" :key="`sheetLayer-item-${item.component}-${index}`"
								v-bind="item.props" :index="index" />
						</template>
					</template>
				</template>
			</SheetLayer>
			<ModalLayer style="z-index: 15" :components="modalComponents" />
			<ProcessingLayer style="z-index: 20" />
			<ToastLayer style="z-index: 25" />
			<DialogLayer style="z-index: 30" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import TheDrawerTest from '@/components/drawer/TheDrawerTest.vue'
import TheDrawerDepthTest from '@/components/drawer/TheDrawerDepthTest.vue'
import TestModal from '@/components/modal/TestModal.vue'
import NestSheet from '@/components/sheet/NestSheet.vue'
import PagenationSheet from '@/components/sheet/PagenationSheet.vue'
import ColorSheet from '@/components/sheet/ColorSheet.vue'

// Constans ----------------------------------------------
// 表示するSheetコンポーネントを定義する
const sheetComponents: Record<
	string,
	| typeof NestSheet
	| typeof PagenationSheet
	| typeof ColorSheet
> = {
	NestSheet,
	PagenationSheet,
	ColorSheet,
}

// 表示するModalコンポーネントを定義する
const modalComponents: Record<string, typeof TestModal> = {
	TestModal,
}

// Composables -----------------------------------------------
const sheet = useSheet()
const modal = useModal()

// Data -----------------------------------------------
const pending = ref(true)

// Computed -----------------------------------------------
const drawer = computed(() => (name: string) => {
	if (useDrawer().lefts.value.some(item => item.name === name)) {
		return true
	}
	if (useDrawer().rights.value.some(item => item.name === name)) {
		return true
	}
	return false
})

// Lifecycle -----------------------------------------------
onMounted(async () => {
	pending.value = true
	try {
		await useUI().init()
		sheet.setComponents(sheetComponents)
		modal.setComponents(modalComponents)
	}
	catch (e) {
		console.error(e)
	}
	pending.value = false
})
</script>

<style lang="scss">
.app {
	position: relative;
	z-index: 0;
	width: 100%;

	&-layers {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
	}
}
</style>

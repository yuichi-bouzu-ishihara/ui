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
				<Nest1Sheet v-if="sheet('nest1')" />
				<Nest2Sheet v-if="sheet('nest2')" />
				<Nest3Sheet v-if="sheet('nest3')" />
				<ColorSheet v-if="sheet('color')" />
			</SheetLayer>
			<ModalLayer style="z-index: 15">
				<TestModal v-if="modalName === 'test'" />
			</ModalLayer>
			<ProcessingLayer style="z-index: 20" />
			<ToastLayer style="z-index: 25" />
			<DialogLayer style="z-index: 30" />
		</div>
	</div>
</template>

<script setup>
import TheDrawerTest from '@/components/drawer/TheDrawerTest.vue'
import TheDrawerDepthTest from '@/components/drawer/TheDrawerDepthTest.vue'
import TestModal from '@/components/modal/TestModal.vue'
import Nest1Sheet from '@/components/sheet/Nest1Sheet.vue'
import Nest2Sheet from '@/components/sheet/Nest2Sheet.vue'
import Nest3Sheet from '@/components/sheet/Nest3Sheet.vue'
import ColorSheet from '@/components/sheet/ColorSheet.vue'

const pending = ref(true)

const sheet = computed(() => (name) => {
	return useSheet().list.value.some(item => item.name === name)
})

const modalName = computed(() => {
	return useModal().name.value
})

const drawer = computed(() => (name) => {
	if (useDrawer().lefts.value.some(item => item.name === name)) {
		return true
	}
	if (useDrawer().rights.value.some(item => item.name === name)) {
		return true
	}
	return false
})

onMounted(async () => {
	pending.value = true
	try {
		await useUI().init()
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

<template>
	<div class="pageOverLaysSheet">
		<Teleport to="#floatingUI" defer>
			<FloatingUI full no-padding no-tab-bar-height>
				<DropdownMenu :list="list" />
			</FloatingUI>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import FloatingUI from '../../../../src/runtime/components/navigation/FloatingUI.vue'
import NestSheet, { type Props as NestSheetProps } from '@/components/sheet/NestSheet.vue'
import PagenationSheet from '@/components/sheet/PagenationSheet.vue'
import ASheet from '@/components/sheet/ASheet.vue'
import BSheet from '@/components/sheet/BSheet.vue'

const sheet = useSheet()
// watch(() => sheet.current.value, (nv) => {
// 	console.log('useSheet().current', nv)
// }, { immediate: true })
watch(() => sheet.list.value, (list) => {
	console.log('useSheet().list', list)
}, { immediate: true, deep: true })

// Data ---------------------------
const list = ref([
	{
		icon: 'plus',
		name: 'ASheet',
		click: () => sheet.open({
			component: ASheet,
			allowDuplicate: false,
		}),
	},
	{
		icon: 'plus',
		name: 'BSheet',
		click: () => sheet.open({
			component: BSheet,
			allowDuplicate: false,
		}),
	},
	{
		icon: 'plus',
		name: 'NestSheet',
		click: () => sheet.open({
			component: NestSheet,
			props: { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' } as NestSheetProps,
			allowDuplicate: true,
		}),
	},
	{
		icon: 'plus',
		name: 'PagenationSheet',
		click: () => sheet.open({
			component: PagenationSheet,
			allowDuplicate: true,
		}),
	},
	{
		icon: 'eyeClose',
		name: 'Close All',
		click: () => {
			sheet.close('all')
		},
	},
	{
		icon: 'eyeOpen',
		name: 'Reopen Last Closed',
		click: () => {
			sheet.reopen()
		},
	},
])
</script>

<style lang="scss"></style>

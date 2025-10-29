<template>
	<div class="pageOverLaysSheet">
		<Container>
			<Column gap="40">
				<Row justify="center" :gap="[8, 8]">
					<Button
						@click="open('SheetMessage', { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' })">
						SheetMessage
					</Button>
					<Button
						@click="open('SheetMessage', { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', full: true, icon: 'edit', buttonName: 'OK' })">
						FullSheet
					</Button>
					<Button
						@click="open('SheetMessage', { title: 'Title', content: 'Text Content is here.', wide: true, icon: 'edit', buttonName: 'OK' })">
						WideSheet
					</Button>
				</Row>
				<Row justify="center" :gap="[8, 8]">
					<Button @click="open(NestSheet, {
						title: 'Title',
						content: 'Text Content is here.<br />Please Test Message.<br /><br />',
						full: true,
						center: true,
						buttonName: 'OK',
					} as NestSheetProps)">
						Nest Test
					</Button>
				</Row>
				<Row justify="center" :gap="[8, 8]">
					<Button
						@click="open('ColorSheet', { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' })">
						ColorSheet
					</Button>
				</Row>
			</Column>
		</Container>
	</div>
</template>

<script setup lang="ts">
import NestSheet from '@/components/sheet/NestSheet.vue'
import type { Props as NestSheetProps } from '@/components/sheet/NestSheet.vue'

const open = async (component: string | Component, props: Record<string, unknown>) => {
	const result = await useSheet().open({ component, props })
	console.log(result)
}

const sheet = useSheet()
watch(() => sheet.current.value, (nv) => {
	console.log('useSheet().current', nv)
}, { immediate: true })
watch(() => sheet.list.value, (list) => {
	console.log('useSheet().list', list)
}, { immediate: true, deep: true })
</script>

<style lang="scss"></style>

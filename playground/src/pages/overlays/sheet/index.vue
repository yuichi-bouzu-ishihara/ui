<template>
	<div class="pageOverLaysSheet">
		<Container>
			<Column gap="40">
				<Row justify="center" :gap="[8, 8]">
					<Button @click="open(SheetMessage, {
						title: 'Title',
						content: 'Text Content is here.<br />Please Test Message.',
						icon: 'edit',
						buttonName: 'OK',
					} as SheetMessageProps)">
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
import SheetMessage, { type Props as SheetMessageProps } from '../../../../src/runtime/components/overlays/SheetMessage.vue'
import NestSheet, { type Props as NestSheetProps } from '@/components/sheet/NestSheet.vue'

const open = async (component: Component, props: Record<string, unknown>) => {
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

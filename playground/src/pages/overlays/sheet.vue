<template>
	<div class="pageOverLaysSheet">
		<Container>
			<Column gap="40">
				<Row justify="center" :gap="[8, 8]">
					<Button @click="open(SheetMessage, {
						title: 'Title',
						content: 'Text Content is here.<br />Please Test Message.',
						icon: 'check',
						buttonName: 'OK',
					} as SheetMessageProps)">
						SheetMessage
					</Button>
					<Button
						@click="open(SheetMessage, { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', full: true, icon: 'edit', buttonName: 'OK' })">
						FullSheet
					</Button>
					<Button
						@click="open(SheetMessage, { title: 'Title', content: 'Text Content is here.', wide: true, icon: 'edit', buttonName: 'OK' })">
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
					<Button @click="open(PagenationSheet)">
						Pagenation
					</Button>
				</Row>
				<Row justify="center" :gap="[8, 8]">
					<Button
						@click="open(ColorSheet, { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' })">
						ColorSheet
					</Button>
				</Row>
			</Column>
		</Container>
		<Teleport to="body">
			<Box fixed bottom="24" right="24" z-index="1000">
				<Column justify="end" gap="8">
					<Button small
						@click="sheet.open({ component: NestSheet, props: { title: 'Title dup: false', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' } })">
						<Icon name="plus" size="16" color="light" /> NestSheet (dup: false)
					</Button>
					<Button small
						@click="sheet.open({ component: NestSheet, props: { title: 'Title dup: true', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' }, allowDuplicate: true })">
						<Icon name="plus" size="16" color="light" /> NestSheet (dup: true)
					</Button>
					<Button small
						@click="sheet.open({ component: SheetMessage, props: { title: 'Title dup: false', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' } })">
						<Icon name="plus" size="16" color="light" /> Message (dup: false)
					</Button>
					<Button small
						@click="sheet.open({ component: SheetMessage, props: { title: 'Title dup: true', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' }, allowDuplicate: true })">
						<Icon name="plus" size="16" color="light" /> Message (dup: true)
					</Button>
				</Column>
			</Box>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import SheetMessage, { type Props as SheetMessageProps } from '../../../../src/runtime/components/overlays/SheetMessage.vue'
import NestSheet, { type Props as NestSheetProps } from '@/components/sheet/NestSheet.vue'
import PagenationSheet from '@/components/sheet/PagenationSheet.vue'
import ColorSheet from '@/components/sheet/ColorSheet.vue'

const open = async (component: Component, props: Record<string, unknown> = {}) => {
	const result = await useSheet().open({ component, props })
	console.log(result)
}

const sheet = useSheet()
// watch(() => sheet.current.value, (nv) => {
// 	console.log('useSheet().current', nv)
// }, { immediate: true })
watch(() => sheet.list.value, (list) => {
	console.log('useSheet().list', list)
}, { immediate: true, deep: true })
</script>

<style lang="scss"></style>

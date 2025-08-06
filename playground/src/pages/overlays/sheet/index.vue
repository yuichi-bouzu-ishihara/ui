<template>
	<div class="pageOverLaysSheet">
		<Container>
			<Column gap="40">
				<Row justify="center" :gap="[8, 8]">
					<Button
						@click="open('message', { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' })">
						SheetMessage
					</Button>
					<Button
						@click="open('message', { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', full: true, icon: 'edit', buttonName: 'OK' })">
						FullSheet
					</Button>
					<Button
						@click="open('message', { title: 'Title', content: 'Text Content is here.', wide: true, icon: 'edit', buttonName: 'OK' })">
						WideSheet
					</Button>
				</Row>
				<Row justify="center" :gap="[8, 8]">
					<Button
						@click="open('nest1', { title: 'Title', content: 'Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />Text Content is here.<br />Please Test Message.<br /><br />', full: true, center: false, icon: 'edit', buttonName: 'OK' })">
						Nest Test
					</Button>
				</Row>
				<Row justify="center" :gap="[8, 8]">
					<Button
						@click="open('color', { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' })">
						ColorSheet
					</Button>
				</Row>
			</Column>
		</Container>
	</div>
</template>

<script setup>
const open = async (name, options) => {
	const result = await useSheet().open({ name, options })
	console.log(result)
}
</script>

<style lang="scss"></style>

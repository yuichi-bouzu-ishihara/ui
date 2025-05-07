<template>
	<div class="pageNavigationTabs">
		<Container>
			<Column gap="40">
				<Tabs :list="list" />
				<Tabs :list="iconList" />
			</Column>
		</Container>
	</div>
</template>

<script setup>
// ver.Click
const list = ref([
	{
		name: 'Menu1',
		current: true,
		click: () => {
			list.value.forEach((item) => {
				item.current = item.name === 'Menu1'
			})
		},
	},
	{
		name: 'Menu2',
		current: false,
		click: () => {
			list.value.forEach((item) => {
				item.current = item.name === 'Menu2'
			})
		},
	},
])

const iconList = ref([
	{
		icon: {
			name: 'x',
			size: 24,
		},
	},
	{
		icon: {
			name: 'instagram',
			size: 24,
		},
	},
	{
		icon: {
			name: 'youtube',
			size: 24,
		},
	},
	{
		icon: {
			name: 'tiktok',
			size: 24,
		},
	},
	{
		icon: {
			name: 'threads',
			size: 24,
		},
	},
])
// ver.Link
// const list = ref([
//   {
//     name: 'Menu1',
//     current: true,
//     path: '#menu1'
//   },
//   {
//     name: 'Menu2',
//     current: false,
//     path: '#menu2'
//   }
// ])
</script>

<style lang="scss"></style>

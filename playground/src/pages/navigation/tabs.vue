<template>
	<div class="pageNavigationTabs">
		<Container full>
			<Column gap="40">
				<Tabs :list="list" />
				<Tabs :list="iconList" />
				<Tabs :list="list" item-width-auto />
				<Tabs :list="iconList" item-width-auto />
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
		notice: true,
		click: () => {
			list.value.forEach((item) => {
				item.current = item.name === 'Menu1'
			})
		},
	},
	{
		name: 'Menu2',
		current: false,
		notice: true,
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
			name: 'calendar',
			size: 18,
		},
		current: true,
		notice: true,
		click: () => {
			handleIconClick(0)
		},
	},
	{
		icon: {
			name: 'grid2',
			size: 18,
		},
		current: false,
		click: () => {
			handleIconClick(1)
		},
	},
	{
		icon: {
			name: 'mail',
			size: 18,
		},
		current: false,
		click: () => {
			handleIconClick(2)
		},
	},
	{
		icon: {
			name: 'phone',
			size: 18,
		},
		click: () => {
			handleIconClick(3)
		},
	},
	{
		icon: {
			name: 'check',
			size: 18,
		},
		current: false,
		click: () => {
			handleIconClick(4)
		},
	},
])

// method ------------------------------------------------------------
const handleIconClick = (index) => {
	iconList.value.forEach((item, i) => {
		item.current = i === index
	})
}
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

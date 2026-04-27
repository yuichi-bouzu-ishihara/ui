<template>
	<div class="pageNavigationTreeMenu">
		<Container narrow>
			<Box pt="40" pb="40">
				<Column gap="24">
					<Typography font-size="20" bold color="light" cap-height-baseline>
						TreeMenu
					</Typography>
					<Column gap="8">
						<TreeMenu v-for="(item, index) in menuItems" :key="`tree-menu-${index}`" v-bind="item" show-count />
					</Column>
				</Column>
			</Box>
		</Container>
	</div>
</template>

<script setup lang="ts">
import type { TreeMenuItem } from '../../../../src/runtime/types/tree-menu'

const menuItems: TreeMenuItem[] = [
	{
		label: 'Getting Started',
		icon: 'home',
		to: '/navigation/tree-menu',
		children: [
			{ label: 'Installation', icon: 'download' },
			{ label: 'Quick Start', icon: 'play' },
		],
	},
	{
		label: 'Components',
		icon: 'grid',
		children: [
			{
				label: 'Elements',
				icon: 'box',
				children: [
					{ label: 'Button', to: '/elements/button' },
					{ label: 'Icon', to: '/elements/icon' },
					{ label: 'Typography', to: '/elements/typography' },
				],
			},
			{
				label: 'Navigation',
				icon: 'menu',
				children: [
					{ label: 'Menu', to: '/navigation/menu' },
					{ label: 'Tabs', to: '/navigation/tabs' },
					{ label: 'TreeMenu', to: '/navigation/tree-menu' },
				],
			},
		],
		ui: [
			{ icon: { name: 'add', size: 14 } },
		],
	},
	{
		label: 'Settings',
		icon: 'setting',
		click: () => {
			// eslint-disable-next-line no-alert
			alert('Custom click handler!')
		},
	},
	{
		label: 'Expanded by Default',
		icon: 'folder',
		expanded: true,
		children: [
			{ label: 'Child A', icon: 'document' },
			{ label: 'Child B', icon: 'document' },
		],
	},
]
</script>

<style lang="scss"></style>

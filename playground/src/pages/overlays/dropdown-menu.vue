<template>
	<Center class="pageOverlayDropdownMenu"
		style="background-image: url(https://cdn.pixabay.com/photo/2024/05/26/15/27/anime-8788959_1280.jpg);">
		<Box w="100vw" pt="80" pb="80" relative z-index="0">
			<Box w="100" mr="auto" ml="auto" relative>
				<Column justify="center" fit>
					<IconButton :icon="{ name: 'arrowUp' }" xsmall rounded @click="toggleMenu('up')" />
					<Row justify="between" fit-w>
						<IconButton :icon="{ name: 'arrowLeft' }" xsmall rounded @click="toggleMenu('left')" />
						<IconButton :icon="{ name: 'arrowRight' }" xsmall rounded @click="toggleMenu('right')" />
					</Row>
					<IconButton :icon="{ name: 'arrowDown' }" xsmall rounded @click="toggleMenu('down')" />
				</Column>
				<TransitionPopover y="20">
					<DropdownMenu v-if="isShowMenu && direction === 'up'" :list="MENUS"
						style="position: absolute; top: calc(-100% - 12px); left: -12px" />
				</TransitionPopover>
				<TransitionPopover x="20">
					<DropdownMenu v-if="isShowMenu && direction === 'left'" :list="MENUS"
						style="position: absolute; top: 0; right: calc(100% + 12px)" />
				</TransitionPopover>
				<TransitionPopover x="-20">
					<DropdownMenu v-if="isShowMenu && direction === 'right'" :list="MENUS"
						style="position: absolute; top: 0; left: calc(100% + 12px)" />
				</TransitionPopover>
				<TransitionPopover y="-20">
					<DropdownMenu v-if="isShowMenu && direction === 'down'" :list="MENUS"
						style="position: absolute; top: calc(100% + 12px); left: -12px" />
				</TransitionPopover>
			</Box>
		</Box>
	</Center>
</template>

<script setup lang="ts">
// Constants ------------------
const MENUS = [
	{
		icon: 'trush',
		name: '削除',
		click: () => {
			console.log('削除')
		},
	},
	{
		icon: 'cross',
		name: 'キャンセル',
		click: () => {
			console.log('キャンセル')
		},
	},
]

// Data ----------------------
const isShowMenu = ref(false)
const direction = ref<'left' | 'right' | 'up' | 'down' | ''>('')

// Methods ----------
const toggleMenu = (dir: 'left' | 'right' | 'up' | 'down') => {
	if (direction.value === dir) {
		isShowMenu.value = false
		direction.value = ''
	}
	else {
		isShowMenu.value = true
		direction.value = dir
	}
}
</script>

<template>
	<Center class="pageOverlayTooltip"
		style="background-image: url(https://cdn.pixabay.com/photo/2024/05/26/15/27/anime-8788959_1280.jpg);">
		<Box w="100vw" pt="80" pb="80" relative z-index="0">
			<Box w="100" m="auto" relative>
				<Column gap="56">
					<Column justify="center" fit>
						<Tooltip text="Tooltip Up">
							<IconButton :icon="{ name: 'arrowUp' }" secondary xsmall rounded @click="handleClick('up')" />
						</Tooltip>
						<Row justify="between" fit-w>
							<Tooltip text="Tooltip Left" placement="left">
								<IconButton :icon="{ name: 'arrowLeft' }" secondary xsmall rounded @click="handleClick('left')" />
							</Tooltip>
							<Tooltip text="Tooltip Right" placement="right">
								<IconButton :icon="{ name: 'arrowRight' }" secondary xsmall rounded @click="handleClick('right')" />
							</Tooltip>
						</Row>
						<Tooltip text="Tooltip Down" placement="down">
							<IconButton :icon="{ name: 'arrowDown' }" secondary xsmall rounded @click="handleClick('down')" />
						</Tooltip>
					</Column>
				</Column>
			</Box>
		</Box>
	</Center>
</template>

<script setup lang="ts">
const handleClick = (placement: string) => {
	console.log('click', placement)
}
</script>

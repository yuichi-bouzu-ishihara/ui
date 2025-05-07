<template>
	<Center class="pageTooltip">
		<Box w="100" relative>
			<Column gap="56">
				<Column justify="center" fit>
					<Tooltip text="Tooltip Up">
						<IconButton :icon="{ name: 'arrowUp' }" tertiary xsmall rounded @click="handleClick('up')" />
					</Tooltip>
					<Row justify="between" fit-w>
						<Tooltip text="Tooltip Left" placement="left">
							<IconButton :icon="{ name: 'arrowLeft' }" tertiary xsmall rounded @click="handleClick('left')" />
						</Tooltip>
						<Tooltip text="Tooltip Right" placement="right">
							<IconButton :icon="{ name: 'arrowRight' }" tertiary xsmall rounded @click="handleClick('right')" />
						</Tooltip>
					</Row>
					<Tooltip text="Tooltip Down" placement="down">
						<IconButton :icon="{ name: 'arrowDown' }" tertiary xsmall rounded @click="handleClick('down')" />
					</Tooltip>
				</Column>
				<Tooltip text="Default Open" placement="left" default-open>
					<Typography caption3 center nowrap cap-height-baseline>
						👈
					</Typography>
				</Tooltip>
			</Column>
		</Box>
	</Center>
</template>

<script setup lang="ts">
const handleClick = (placement: string) => {
	console.log('click', placement)
}
</script>

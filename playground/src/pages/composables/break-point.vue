<template>
	<Box>
		<Typography center color="light">
			<mark><strong>{{ currentScreenSize.toUpperCase() }}</strong></mark>
		</Typography>
		<Typography center color="100">
			base above ? {{ baseAbove() }}
		</Typography>
	</Box>
</template>

<script setup>
const breakpoint = useBreakPoint()
const { currentScreenSize, baseAbove } = breakpoint
</script>

<style lang="scss"></style>

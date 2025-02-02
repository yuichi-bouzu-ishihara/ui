<template>
	<Box>
		<Typography center color="light">
			<Mark><strong>{{ currentScreenSize.toUpperCase() }}</strong></Mark>
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

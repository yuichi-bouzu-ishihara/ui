<template>
	<Box>
		<Typography center color="light">
			<mark><strong>{{ currentScreenSize.toUpperCase() }}</strong></mark>
		</Typography>
		<Typography center color="100">
			base above ? {{ baseAbove() }}<br>
			watch baseAbove ? {{ watchBaseAbove }}
		</Typography>
	</Box>
</template>

<script setup>
const breakpoint = useBreakPoint()
const { currentScreenSize, baseAbove } = breakpoint
const watchBaseAbove = ref('')
watch(
	() => baseAbove(),
	(nv) => {
		watchBaseAbove.value = nv
	},
	{ immediate: true },
)
</script>

<style lang="scss"></style>

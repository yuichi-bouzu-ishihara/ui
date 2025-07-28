<template>
	<div class="pageFormsColorModeSwitch">
		<Container narrow>
			<Center>
				<ColorModeSwitch v-model="value" />
			</Center>
		</Container>
	</div>
</template>

<script setup>
const value = ref('dark')

watch(() => value.value, (newVal) => {
	const defaultColor = useAppConfig().ui.color
	if (newVal === 'dark') {
		useColor().update({
			...defaultColor,
			background: defaultColor.background,
			text: defaultColor.text,
		})
	}
	else {
		useColor().update({
			...defaultColor,
			background: defaultColor.text,
			text: defaultColor.background,
		})
	}
})
</script>

<style lang="scss"></style>

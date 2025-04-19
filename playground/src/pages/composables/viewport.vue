<template>
	<div>
		<Typography center color="100">
			width ? {{ width }}<br>
			height ? {{ height }}<br>
			initWidth ? {{ initWidth }}<br>
			initHeight ? {{ initHeight }}<br>
			keyboardHeight ? {{ keyboardHeight }}
		</Typography>
	</div>
</template>

<script setup>
const viewport = useViewport()
const { width, height, initWidth, initHeight, keyboardHeight } = viewport
</script>

<style lang="scss"></style>

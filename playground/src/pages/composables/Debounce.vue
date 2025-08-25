<template>
	<Container narrow>
		<Column gap="20">
			<Typography center color="light">
				Click Count: {{ clickCount }} / <strong>Debounce Count: {{ debounceCount }}</strong>
			</Typography>
			<Button @click="onClick">
				Debounce
			</Button>
		</Column>
	</Container>
</template>

<script setup>
const clickCount = ref(0)
const debounceCount = ref(0)
const test = () => {
	debounceCount.value++
}
const debounce = useDebounce(test, 1000)
const onClick = () => {
	clickCount.value++
	debounce()
}
</script>

<style lang="scss"></style>

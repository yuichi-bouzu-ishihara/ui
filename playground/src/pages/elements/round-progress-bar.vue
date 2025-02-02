<template>
	<Container narrow>
		<Center>
			<RoundProgressBar v-bind="{ percent, stroke, size }" />
		</Center>
	</Container>
</template>

<script setup lang="ts">
// Data ------------------------------------------------
const percent = ref(0)
const stroke = ref(4)
const size = ref(80)

onMounted(async () => {
	await nextTick()
	await useUtils().wait(1000)
	percent.value = Math.floor(Math.random() * 81) + 10
})
</script>

<style lang="scss"></style>

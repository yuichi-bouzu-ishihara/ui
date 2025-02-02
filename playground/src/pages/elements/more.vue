<template>
	<div class="pageElementsMore">
		<Container>
			<More v-bind="{ loading }" gap="20" @reached="onBottomReached">
				<div class="pageElementsMore-inner">
					<Box v-for="n of num" :key="`dummuy-${n}`" class="pageElementsMore-inner-item" color="dark">
						<Ratio square />
					</Box>
				</div>
			</More>
		</Container>
	</div>
</template>

<script setup lang="ts">
// Data ----------
const loading = ref<boolean>(false)
const num = ref<number>(4)

// Methods ----------
const onBottomReached = async () => {
	if (loading.value) return

	loading.value = true
	await useUtils().wait(2000)
	num.value += 4
	await nextTick()
	loading.value = false
}
</script>

<style lang="scss">
.pageElementsMore {
	&-inner {
		display: grid;
		gap: 1px;
		grid-template-columns: repeat(4, 1fr);
	}
}
</style>

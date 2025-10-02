<template>
	<div class="pageNavigationPagenation">
		<Container narrow>
			<Center>
				<Pagenation v-bind="{ current, total }" />
			</Center>
		</Container>
	</div>
</template>

<script setup>
const current = ref(1)
const total = ref(5)
</script>

<style lang="scss"></style>

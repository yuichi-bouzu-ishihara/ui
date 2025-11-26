<template>
	<div class="pageNavigationPagenation">
		<Container narrow>
			<Center>
				<Column gap="20">
					<Pagenation v-bind="{ current, total, disabled }" @click-item="handleClickItem" />
					<Switch v-model="disabled" name="disabled" label="Disabled" />
				</Column>
			</Center>
		</Container>
	</div>
</template>

<script setup>
const current = ref(1)
const total = ref(5)
const disabled = ref(false)
const handleClickItem = (index) => {
	console.log(index)
	current.value = index
}
</script>

<style lang="scss"></style>

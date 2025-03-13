<template>
	<div class="pageFormsInput">
		<Container>
			<Row justify="center" gap="8">
				<Typography caption2 bold>
					<InputTag v-model="value" name="inputTagTest" label="ラベル" placeholder="プレースホルダープレースホルダー" max="7" focus />
				</Typography>
			</Row>
		</Container>
	</div>
</template>

<script setup>
const value = ref([{ id: 1, value: 'item1' }, { id: 2, value: 'item2' }, { id: 3, value: 'item3' }, { id: 4, value: 'item4' }, { id: 5, value: 'item5' }])
</script>

<style lang="scss"></style>

<template>
	<div class="pageFormsSelect">
		<Typography caption1 bold>
			<Container narrow>
				<Row justify="center" gap="8" fit-w>
					<Select v-model="value" name="selectTest" label="Label" v-bind="{ options }" />
				</Row>
			</Container>
		</Typography>
	</div>
</template>

<script setup>
const value = ref('')
const options = [
	{
		value: '1',
		name: 'Option 1',
	},
	{
		value: '2',
		name: 'Option 2',
		disabled: true,
	},
	{
		value: '3',
		name: 'Option 3',
	},
]
</script>

<style lang="scss"></style>

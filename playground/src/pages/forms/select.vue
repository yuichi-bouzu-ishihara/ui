<template>
	<div class="pageFormsSelect">
		<Typography title1 bold>
			<Container wide>
				<Row justify="center" gap="40" fit-w nowrap>
					<Box w="240">
						<Select v-model="value" name="selectTest" label="Label" placeholder="Placeholder" v-bind="{ options }" />
					</Box>
					<Box w="300">
						<Input v-model="value" name="selectTest" label="Label" placeholder="Placeholder" v-bind="{ options }" />
					</Box>
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

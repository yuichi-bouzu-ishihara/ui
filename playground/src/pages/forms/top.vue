<template>
	<div class="pageFormsTop">
		<Typography caption1 bold>
			<Container narrow>
				<Row justify="center" gap="8" fit-w nowrap>
					<Box w="80">
						<Input v-model="value" name="inputTest" label="Label" placeholder="Placeholder" />
					</Box>
					<Box w="140">
						<Select v-model="value" name="selectTest" placeholder="プレースホルダー" v-bind="{ options }" />
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
		value: 'Label',
		name: 'Label',
	},
	{
		value: 'Option2',
		name: 'Option 2',
		disabled: true,
	},
	{
		value: 'Option3',
		name: 'Option 3',
	},
]
</script>

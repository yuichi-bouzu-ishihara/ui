<template>
	<div class="pageFormsInputDatalist">
		<Column justify="center" gap="40">
			<Typography title1 color="100">
				<InputDatalist v-model="value" name="inputDatalistTest" label="Label" placeholder="Placeholder" :focus="focus"
					:list="[
						'item1',
						'item2',
						'item3',
						'item4',
						'item5',
					]" />
			</Typography>
			<Switch v-model="focus" name="focus">
				Focus
			</Switch>
		</Column>
	</div>
</template>

<script setup>
const value = ref('')
const focus = ref(false)
</script>

<style lang="scss"></style>

<template>
	<div class="pageFormsInputSearch">
		<Column justify="center" gap="40">
			<Typography headline color="100">
				<InputSearch v-model="value" name="inputTest" label="Label" placeholder="Input Keyword" :focus="focus" clear />
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

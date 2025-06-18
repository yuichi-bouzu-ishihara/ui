<template>
	<div class="pageFormsInput">
		<Column justify="center" gap="40">
			<Typography title1 color="100">
				<InputDateTime v-model="value" name="inputTest" label="Label" :focus="focus" />
			</Typography>
			<Switch v-model="focus">
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

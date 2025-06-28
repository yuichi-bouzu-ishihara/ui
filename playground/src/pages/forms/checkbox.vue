<template>
	<div class="pageFormsCheckbox">
		<Container>
			<Column gap="40">
				<Checkbox v-model="value" name="checkboxTestSlot">
					Slot Label
				</Checkbox>
				<Checkbox v-model="value" name="checkboxTest" label="Label" description="Description text is inserted here." />
				<Checkbox v-model="disabledValue" name="checkboxTestDisabled" label="Disabled"
					description="disabled will not be submitted." disabled />
				<Checkbox v-model="value" name="checkboxTestReadonly" label="Readonly"
					description="The checkbox is in read-only mode and cannot be changed by the user." readonly />
			</Column>
		</Container>
	</div>
</template>

<script setup>
const value = ref(false)
const disabledValue = ref(false)
</script>

<style lang="scss"></style>

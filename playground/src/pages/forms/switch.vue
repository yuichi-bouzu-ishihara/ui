<template>
	<div class="pageFormsSwitch">
		<Container narrow>
			<Column gap="40">
				<Switch v-model="value" name="switchTestSlot">
					Slot Label
				</Switch>
				<Switch v-model="value" name="switchTest" label="Label" description="Description text is inserted here." />
				<Switch v-model="disabledValue" name="switchTestDisabled" label="Disabled"
					description="disabled will not be submitted." disabled />
				<Switch v-model="value" name="switchTestReadonly" label="Readonly"
					description="The switch is in read-only mode and cannot be changed by the user." readonly />
			</Column>
		</Container>
	</div>
</template>

<script setup>
const value = ref(false)
const disabledValue = ref(false)
</script>

<style lang="scss"></style>

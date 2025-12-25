<template>
	<div class="pageFormsTextarea">
		<Column justify="center" gap="40">
			<Typography title1>
				<Textarea v-model="value" name="textareaTest" label="ラベル" placeholder="プレースホルダー" max-rows="5"
					v-bind="{ focus, disabled, readonly }" />
			</Typography>
			<Switch v-model="focus" name="focus">
				Focus
			</Switch>
			<Switch v-model="disabled" name="disabled">
				Disabled
			</Switch>
			<Switch v-model="readonly" name="readonly">
				Readonly
			</Switch>
		</Column>
	</div>
</template>

<script setup>
const value = ref('')
const focus = ref(false)
const disabled = ref(false)
const readonly = ref(false)
</script>

<style lang="scss"></style>

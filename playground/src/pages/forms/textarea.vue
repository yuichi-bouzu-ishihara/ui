<template>
	<div class="pageFormsTextarea">
		<Column justify="center" gap="40">
			<Typography title1>
				<Textarea v-model="value" name="textareaTest" label="ラベル" placeholder="プレースホルダー" max-rows="5" :focus="focus" />
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

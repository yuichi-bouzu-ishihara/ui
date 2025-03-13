<template>
	<div class="pageFormsInput">
		<Row justify="center" gap="8">
			<Typography title1>
				<Input v-model="value" name="inputTest" label="ラベル" placeholder="プレースホルダー" maxlength="10" validation="always"
					focus @focus="focus = true" @blur="focus = false" @valid="fail = false" @invalid="fail = true" />
				<FieldFooter v-bind="{ fail, focus, message }" description="This Area is Description Insert." />
			</Typography>
		</Row>
	</div>
</template>

<script setup>
const value = ref('')
const focus = ref(false)
const fail = ref(false)
const message = computed(() => fail.value ? 'Invalid Input.' : '')
</script>

<style lang="scss"></style>

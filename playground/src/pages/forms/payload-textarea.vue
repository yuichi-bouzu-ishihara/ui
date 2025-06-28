<template>
	<div class="pageFormsTextarea">
		<Container>
			<PayloadTextarea v-model="value" label="Payload" />
		</Container>
	</div>
</template>

<script setup lang="ts">
const json = { name: 'John', age: 30, city: 'New York' }
const value = ref(JSON.stringify(json, null, 2))
</script>

<style lang="scss"></style>

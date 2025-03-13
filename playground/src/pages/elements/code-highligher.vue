<template>
	<div class="pageElementsCodeHighlighter">
		<Column gap="20">
			<Container>
				<CodeHighlighter title="test.json" :code="JSON.stringify(json, null, 2)" lang="json" />
			</Container>
			<Container>
				<CodeHighlighter title="test.json" :code="JSON.stringify(json, null, 2)" lang="json" color="light" />
			</Container>
		</Column>
	</div>
</template>

<script setup>
const json = {
	id: 1,
	name: '山田太郎',
	age: 30,
	email: 'yamada@example.com',
	isActive: true,
	hobbies: ['読書', '旅行', '料理'],
	address: {
		city: '東京',
		street: '渋谷区渋谷1-1-1',
		postalCode: '150-0002',
	},
}
</script>

<style lang="scss"></style>

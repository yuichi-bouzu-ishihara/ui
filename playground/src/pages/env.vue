<template>
	<div class="pageIndex">
		<Container>
			<Column justify="center" gap="12">
				<CodeHighlighter title="Public Config" lang="json" :code="JSON.stringify(runtimeConfig.public, null, 2)" />
			</Column>
		</Container>
	</div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
</script>

<style lang="scss"></style>

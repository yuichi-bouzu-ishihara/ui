<template>
	<div class="pageComposablesEnvironment">
		<Container>
			<Column justify="center" gap="12">
				<CodeHighlighter title="Public Config" lang="json"
					:code="JSON.stringify({ userAgent, device, devicePixelRatio, language, os, browser, touchDevice }, null, 2)" />
			</Column>
		</Container>
	</div>
</template>

<script setup lang="ts">
const { userAgent, device,
	devicePixelRatio,
	language,
	os,
	browser,
	touchDevice } = useEnvironment()
</script>

<style lang="scss"></style>

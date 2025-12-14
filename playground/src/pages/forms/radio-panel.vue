<template>
	<div class="pageFormsRadioPanel">
		<Container>
			<Column gap="56">
				<RadioPanel v-model="value" large name="radioPanelTest" :options="LIST" split="5" gap="8" title="Large" />
				<RadioPanel v-model="value" large name="radioPanelTestFree" :options="LIST_INCLUDE_FEE" split="5" gap="8"
					title="Large" />
				<RadioPanel v-model="value" name="radioPanelTest" :options="LIST" split="5" gap="8" title="Medium" />
				<RadioPanel v-model="value" small name="radioPanelTest" :options="LIST" split="5" gap="8" title="Small" />
				<RadioPanel v-model="value" xsmall name="radioPanelTest" :options="LIST" split="5" gap="8" title="XSmall" />
			</Column>
		</Container>
	</div>
</template>

<script setup>
const value = ref(2)
const LIST = [
	{ value: 1, label: '1' },
	{ value: 2, label: '2' },
	{ value: 3, label: '3' },
	{ value: 4, label: '4' },
	{ value: 5, label: '5' },
]
const LIST_INCLUDE_FEE = [
	{ value: 100, label: '¥100' },
	{ value: 500, label: '¥500' },
	{ value: 1000, label: '¥1,000' },
	{ value: 5000, label: '¥5,000' },
	{ value: 0, label: 'その他', free: { min: 100, max: 10000, step: 100, default: 500 } },
]
</script>

<style lang="scss"></style>

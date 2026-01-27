<template>
	<div class="pageFormsRadioPanel">
		<Container>
			<Column gap="56">
				<Column gap="8">
					<RadioPanel v-model="value1" large name="radioPanelTest" :options="LIST" :split="LIST.length.toString()"
						gap="8" title="Size" />
					<RadioPanel v-model="value1" name="radioPanelTest" :options="LIST" :split="LIST.length.toString()" gap="8" />
					<RadioPanel v-model="value1" small name="radioPanelTest" :options="LIST" :split="LIST.length.toString()"
						gap="8" />
					<RadioPanel v-model="value1" xsmall name="radioPanelTest" :options="LIST" :split="LIST.length.toString()"
						gap="8" />
				</Column>
				<RadioPanel v-model="value2" name="radioPanelTestFree" :options="LIST_INCLUDE_FEE"
					:split="LIST_INCLUDE_FEE.length.toString()" gap="8" @checked-free="console.log('checked-free')"
					@unchecked-free="console.log('unchecked-free')">
					<template #before-free-input>
						<Typography body center bold>
							¥{{ joinComma(value2) }}
						</Typography>
					</template>
				</RadioPanel>
				<Column gap="8">
					<RadioPanel v-model="value2" large name="radioPanelTest" :options="LIST_INCLUDE_FEE"
						:split="LIST_INCLUDE_FEE.length.toString()" gap="8" title="Include Free Size" />
					<RadioPanel v-model="value2" name="radioPanelTest" :options="LIST_INCLUDE_FEE"
						:split="LIST_INCLUDE_FEE.length.toString()" gap="8" />
					<RadioPanel v-model="value2" small name="radioPanelTest" :options="LIST_INCLUDE_FEE"
						:split="LIST_INCLUDE_FEE.length.toString()" gap="8" />
					<RadioPanel v-model="value2" xsmall name="radioPanelTest" :options="LIST_INCLUDE_FEE"
						:split="LIST_INCLUDE_FEE.length.toString()" gap="8" />
				</Column>
			</Column>
		</Container>
	</div>
</template>

<script setup>
const { joinComma } = useNumber()
const value1 = ref(0)
const value2 = ref(2)
const LIST = [
	{ value: 0, label: '0' },
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
	{ value: Infinity, label: 'その他', free: { min: 100, max: 10000, step: 100, default: 500 } },
]
</script>

<style lang="scss"></style>

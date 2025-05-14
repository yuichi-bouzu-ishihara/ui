<template>
	<Column class="radioPanel" gap="16">
		<Typography v-if="title" caption1 bold cap-height-baseline>
			{{ title }}
		</Typography>
		<Row v-bind="{ split, gap }">
			<label v-for="option in options" :key="`radioPanel-item-${option.value}`" class="radioPanel-item"
				:class="{ _checked: value === option.value }">
				<input type="radio" :value="option.value" :checked="value === option.value"
					@change="handleChange(option.value)">
				<Typography caption2 bold center cap-height-baseline unselectable
					:color="value === option.value ? 'background' : 'text'">
					{{ option.label }}
				</Typography>
			</label>
		</Row>
	</Column>
</template>

<script setup lang="ts">
// Types ------------------
type Option = {
	value: number
	label: string
}

// Models ------------------
const value = defineModel<number>({ default: 0 })

// Props ------------------
defineProps({
	title: { type: String, default: '' },
	split: { type: String, default: '3' },
	gap: { type: String, default: '8' },
	options: { type: Array as () => Option[], required: true },
})

// Methods ------------------
const handleChange = (val: number) => {
	value.value = val
}
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
$cn: '.radioPanel'; // コンポーネントクラス名

#{$cn} {
	&-item {
		position: relative;
		z-index: 0;
		padding: 11.2px 12px 12.4px;
		background-color: var(--color-text-005);
		border-radius: 3px;
		cursor: pointer;
		transition: var.$transition-base;

		input {
			display: none;
		}

		&:hover {
			background-color: var(--color-text-010);
		}

		&:active {
			opacity: 0.8;
			transform: scale(0.98);
		}

		&._checked {
			background-color: var(--color-text);
			opacity: 1;
		}
	}
}
</style>

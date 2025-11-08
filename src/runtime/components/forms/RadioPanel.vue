<template>
	<Column class="radioPanel" :class="classes" gap="16">
		<Typography v-if="title" v-bind="typography" cap-height-baseline>
			{{ title }}
		</Typography>
		<Row v-bind="{ split, gap }">
			<label v-for="option in options" :key="`radioPanel-item-${option.value}`" class="radioPanel-item"
				:class="{ _checked: value === option.value }">
				<input type="radio" :value="option.value" :checked="value === option.value"
					@change="handleChange(option.value)">
				<Typography class="radioPanel-item-text" v-bind="typography" center cap-height-baseline
					:color="value === option.value ? 'background' : 'text'">
					{{ option.label }}
				</Typography>
			</label>
		</Row>
	</Column>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useForms } from '../../composables/forms'
import Typography from '../elements/Typography.vue'
import Column from '../layout/Column.vue'
import Row from '../layout/Row.vue'

// Composables ---------------------------
const { config } = useForms()

// Types ------------------
type Option = {
	value: number
	label: string
}

// Models ------------------
const value = defineModel<number>({ default: 0 })

// Props ------------------
const props = defineProps({
	title: { type: String, default: '' },
	split: { type: String, default: '3' },
	gap: { type: String, default: '8' },
	options: { type: Array as () => Option[], required: true },

	// サイズ
	large: { type: Boolean, default: false },
	medium: { type: Boolean, default: false },
	small: { type: Boolean, default: false },
	xsmall: { type: Boolean, default: false },
})

// Computed ------------------
const classes: object = computed(() => {
	const obj: Record<string, boolean> = {}
	obj[`_${size.value}`] = true
	return obj
})
const size = computed(() => {
	if (props.large) return 'large'
	if (props.medium) return 'medium'
	if (props.small) return 'small'
	if (props.xsmall) return 'xsmall'
	return 'medium' // デフォルトのサイズ
})
const typography = computed(() => {
	let fontSize = '13px'
	const configValue = config.value?.radioPanel?.[size.value]
	if (configValue && configValue.textSize) {
		fontSize = configValue.textSize
	}

	return {
		fontSize,
		bold: true,
		unselectable: true,
		nowrap: true,
	}
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
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--forms-radio-panel-background-color);
		cursor: pointer;
		transition: var.$transition-base;

		input {
			display: none;
		}

		&:hover {
			opacity: 0.9;
		}

		&:active {
			opacity: 0.8;
			transform: scale(0.98);
		}

		&-text {
			color: var(--forms-radio-panel-text-color);
		}

		&._checked {
			background-color: var(--forms-radio-panel-checked-background-color);
			opacity: 1;
		}

		&._checked &-text {
			color: var(--forms-radio-panel-checked-text-color);
		}
	}

	// サイズ別スタイル設定 -----------------------
	// xsmall
	&._xsmall &-item {
		height: var(--forms-radio-panel-xsmall-height);
		border-radius: var(--forms-radio-panel-xsmall-radius);
		padding: 0 var(--forms-radio-panel-xsmall-padding-h);

		#{$cn}-item-text {
			margin-top: var(--forms-radio-panel-xsmall-text-adjust-top);
		}
	}

	&._small &-item {
		height: var(--forms-radio-panel-small-height);
		border-radius: var(--forms-radio-panel-small-radius);
		padding: 0 var(--forms-radio-panel-small-padding-h);

		#{$cn}-item-text {
			margin-top: var(--forms-radio-panel-small-text-adjust-top);
		}
	}

	&._medium &-item {
		height: var(--forms-radio-panel-medium-height);
		border-radius: var(--forms-radio-panel-medium-radius);
		padding: 0 var(--forms-radio-panel-medium-padding-h);

		#{$cn}-item-text {
			margin-top: var(--forms-radio-panel-medium-text-adjust-top);
		}
	}

	// Large
	&._large &-item {
		height: var(--forms-radio-panel-large-height);
		border-radius: var(--forms-radio-panel-large-radius);
		padding: 0 var(--forms-radio-panel-large-padding-h);

		#{$cn}-item-text {
			margin-top: var(--forms-radio-panel-large-text-adjust-top);
		}
	}
}
</style>

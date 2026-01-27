<template>
	<div class="radioPanel" :class="classes">
		<div v-if="title">
			<Typography v-bind="typography" cap-height-baseline>
				{{ title }}
			</Typography>
			<Box h="16" />
		</div>
		<Row v-bind="{ split, gap }">
			<label v-for="option in options" :key="`radioPanel-item-${option.value}`" class="radioPanel-item"
				:class="{ _checked: selectedOptionValue === option.value }">
				<input type="radio" :value="option.value" :checked="selectedOptionValue === option.value"
					@click="change(option.value)">
				<Typography class="radioPanel-item-text" v-bind="typography" center cap-height-baseline
					:color="selectedOptionValue === option.value ? 'background' : 'text'">
					{{ option.label }}
				</Typography>
			</label>
		</Row>
		<TransitionAcordion>
			<Box v-if="isCurrentFree && freeOption">
				<Box h="20" />
				<slot name="before-free-input" />
				<Box ml="-8" mr="-8">
					<InputRange v-model="freeValue" controls :min="freeOption.min" :max="freeOption.max"
						:step="freeOption.step" />
				</Box>
				<Box h="6" />
			</Box>
		</TransitionAcordion>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForms } from '../../composables/forms'
import Typography from '../elements/Typography.vue'
import Row from '../layout/Row.vue'

// Composables ---------------------------
const { config } = useForms()

// Types ------------------
type Option = {
	value: number
	label: string
	free?: {
		min: number
		max: number
		step: number
		default: number
	}
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

// Emits ------------------
const emit = defineEmits(['checked-free', 'unchecked-free'])

// Data ------------------
// 選択されたオプションのvalueを保持
const selectedOptionValue = ref<number>(0)
// 自由入力の値を保持
const freeValue = ref<number>(0)

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
// 現在選択されているオプションが自由入力可能かどうか
const isCurrentFree = computed(() => {
	const option = props.options.find(option => option.value === selectedOptionValue.value)
	return !!option?.free
})
// 自由入力の設定
const freeOption = computed(() => {
	return props.options.find(option => option.value === selectedOptionValue.value)?.free
})

// Watch ------------------
// valueの外部からの変更を監視（初期値の設定など）
watch(() => value.value, (newValue) => {
	// 現在Freeが選択されている場合は、valueが他のオプションのvalueと一致しても
	// selectedOptionValueを変更しない（Free選択を維持する）
	if (isCurrentFree.value && freeOption.value) {
		// 自由入力モードの場合、valueをfreeValueに反映
		if (newValue >= freeOption.value.min && newValue <= freeOption.value.max) {
			freeValue.value = newValue
		}
		return
	}

	// Freeが選択されていない場合のみ、valueがoptionsのいずれかのvalueと一致するかチェック
	const matchingOption = props.options.find(option => option.value === newValue)
	if (matchingOption) {
		if (matchingOption.free) {
			freeValue.value = matchingOption.free.default ?? matchingOption.free.min
		}
	}

	// 選択されたオプションのvalueを更新
	selectedOptionValue.value = newValue
}, { immediate: true })

// 自由入力の値が変更されたら、valueを更新
watch(() => freeValue.value, (newFreeValue) => {
	if (isCurrentFree.value) {
		value.value = newFreeValue
	}
})

// Methods ------------------
const change = (val: number) => {
	selectedOptionValue.value = val

	const currentOption = props.options.find(option => option.value === val)
	if (currentOption?.free) {
		// 自由入力モードの場合、default値または現在のfreeValueを使用
		const defaultValue = currentOption.free.default ?? currentOption.free.min
		freeValue.value = defaultValue
		value.value = defaultValue
		emit('checked-free')
	}
	else {
		// 通常のオプションの場合、そのvalueを設定
		value.value = val
		emit('unchecked-free')
	}
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

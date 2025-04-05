<template>
	<Row class="switch" :class="classes" gap="8" align="start">
		<input :id="getId" v-model="checked" type="checkbox" class="switch-input" v-bind="{ disabled, readonly, name }">
		<label :for="getId" class="switch-handle" />
		<template v-if="hasSlot">
			<Typography tag="label" :for="getId" class="switch-label" caption2 unselectable>
				<slot />
			</Typography>
		</template>
	</Row>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Row from '../layout/Row.vue'
import Typography from '../elements/Typography.vue'

// Props ------------------
const props = defineProps({
	name: { type: String, required: true }, // ユニークな名前をつける
	modelValue: { type: Boolean, default: false },
	readonly: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
})

// Emits ------------------
const emit = defineEmits<{
	(event: 'update:modelValue', checked: boolean): void
}>()

// Computed ---------------------------
const classes = computed(() => {
	return {
		_checked: checked.value,
		_disabled: props.disabled,
		_readonly: props.readonly,
	}
})
const getId = computed(() => `switch-${props.name}`)
const checked = computed({
	get: () => props.modelValue,
	set: (value) => {
		// 値に変更があると呼ばれるsetter
		emit('update:modelValue', value)
	},
})
const hasSlot = computed(() => {
	return !!useSlots().default
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.switch'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	// サイズ
	$width: 26px;
	$height: 16px;
	$handle-size: 12px;
	$padding: 2px;

	// スイッチの背景色
	$color: var(--color-indicator-020); // スイッチOFF時の背景色
	$color-checked: var(--color-success); // スイッチON時の背景色

	@if $mode =='base' {
		width: auto;
		@include mix.tap-highlight-transparent();

		input {
			/* チェックボックスは使わないので非表示 */
			display: none;
		}

		input:checked+label {
			background-color: $color-checked;

			&::before {
				/* スイッチONの時の左側余白 */
				left: calc($width - $handle-size - $padding);
			}
		}

		input:checked~&-label {
			opacity: 1;
		}

		input:disabled~&-handle,
		input:disabled~&-label {
			cursor: default;
		}

		&-handle {
			position: relative;
			background-color: $color;
			border-radius: var.$border-radius-full;
			/* 角丸 */
			cursor: pointer;
			display: flex;
			align-items: center;
			font-size: 12px;
			width: $width;
			height: $height;
			transition: 0.2s;

			&::before {
				position: absolute;
				background-color: var(--color-handle);
				border-radius: 100%;
				content: '';
				width: $handle-size;
				height: $handle-size;
				left: 2px;
				transition: 0.2s ease-out;
			}
		}

		&-label {
			margin-top: -1.6px;
			cursor: pointer;
			opacity: 0.6;
			transition: var.$transition-base;
		}

		&._disabled,
		&._readonly {
			opacity: 0.6;
			pointer-events: none;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

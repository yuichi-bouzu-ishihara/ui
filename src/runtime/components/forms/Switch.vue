<template>
	<Row class="switch" :class="classes" gap="10" align="start" nowrap>
		<input :id="getId" v-model="checked" type="checkbox" class="switch-input" v-bind="{ name }"
			:disabled="disabled || readonly">
		<label :for="getId" class="switch-handle" />
		<ControlLabel class="switch-label" :for-id="getId" v-bind="{ label, description }">
			<slot />
		</ControlLabel>
		<input v-if="readonly" type="hidden" v-bind="{ name }" :value="checked">
	</Row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Row from '../layout/Row.vue'
import ControlLabel from './ControlLabel.vue'

// Models ------------------
const checked = defineModel<boolean>({ required: true })

// Props ------------------
const props = defineProps({
	name: { type: String, required: true }, // ユニークな名前をつける
	label: { type: String, default: '' },
	description: { type: String, default: '' },
	readonly: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
})

// Computed ---------------------------
const classes = computed(() => {
	return {
		_checked: checked.value,
		_disabled: props.disabled,
		_readonly: props.readonly,
	}
})
const getId = computed(() => `switch-${props.name}`)
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.switch'; // コンポーネントセレクタ名

#{$cn} {
	// サイズ
	$width: 26px;
	$height: 16px;
	$handle-size: 12px;
	$padding: 2px;

	// スイッチの背景色
	$color: var(--color-control-005); // スイッチOFF時の背景色
	$color-checked: var(--color-success); // スイッチON時の背景色

	width: auto;
	@include mix.tap-highlight-transparent();

	&-input {
		/* チェックボックスは使わないので非表示 */
		display: none;

		&:checked+#{$cn}-handle {
			background-color: $color-checked;

			&::before {
				/* スイッチONの時の左側余白 */
				left: calc($width - $handle-size - $padding);
			}
		}
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
		min-width: $width;
		height: $height;
		min-height: $height;
		transition: 0.2s;

		&::before {
			position: absolute;
			background-color: var(--color-indicator);
			border-radius: 100%;
			content: '';
			width: $handle-size;
			min-width: $handle-size;
			height: $handle-size;
			min-height: $handle-size;
			left: 2px;
			transition: 0.2s ease-out;
		}
	}

	&-label {
		margin-top: 1.6px;
	}

	&._disabled>&-handle,
	&._disabled>&-label {
		opacity: 0.6;
		cursor: default;
		pointer-events: none;
	}

	&._readonly>&-handle,
	&._readonly>&-label {
		cursor: default;
		pointer-events: none;
	}
}
</style>

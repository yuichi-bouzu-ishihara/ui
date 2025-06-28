<template>
	<Row class="checkbox" :class="classes" gap="10" align="start" nowrap>
		<input :id="getId" ref="field" v-model="checked" class="checkbox-input" type="checkbox" v-bind="{ name }"
			:disabled="disabled || readonly">
		<label class="checkbox-handle" :for="getId" />
		<ControlLabel class="checkbox-label" :for-id="getId" v-bind="{ label, description }">
			<slot />
		</ControlLabel>
		<input v-if="readonly" type="hidden" v-bind="{ name }" :value="checked">
	</Row>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import ControlLabel from './ControlLabel.vue'

// Models ------------------
const checked = defineModel<boolean>({ required: true })

// Props ------------------
const props = defineProps({
	name: { type: String, required: true },
	label: { type: String, default: '' },
	description: { type: String, default: '' },
	readonly: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false }, // 入力無効かどうか
})

// Data ---------------------------
const field: Ref<HTMLInputElement | null> = ref(null)
const getId: string = `checkbox-${props.name}`

// Computed ------------------
const classes = computed(() => {
	const obj: {
		_disabled: boolean
		[key: string]: boolean
	} = {
		_disabled: props.disabled,
		_readonly: props.readonly,
	}
	return obj
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.checkbox'; // コンポーネントクラス名

$border-default-width: 0.5px;
$border-readonly: none;
$border-radius: 2px;
$border-default: $border-default-width solid var(--color-indicator-030);
$border-hover: $border-default-width solid var(--color-indicator-080);
$border-focus: $border-default-width solid var(--color-indicator-060);
$border-danger: $border-default-width solid var(--color-danger);

$checkbox-rect-size: 16px;
$checkbox-icon-size: 8px;
$checkbox-icon-width: 2px;
$checkbox-icon-color: var(--color-indicator);
$checkbox-bg-color-default: var(--color-control-000);
$checkbox-bg-color-hover: var(--color-control-000);
$checkbox-bg-color-focus: var(--color-control-000);
$checkbox-bg-color-danger: var(--color-control-000);
$checkbox-bg-color-checked: var(--color-success);
$checkbox-border-default: $border-default;
$checkbox-border-hover: $border-hover;
$checkbox-border-focus: $border-focus;
$checkbox-border-danger: $border-danger;
$checkbox-border-checked: 1px solid var(--color-success);
$checkbox-box-shadow-default: 0 0 0 0 var(--color-indicator-000);
$checkbox-box-shadow-hover: 0 0 0 2px var(--color-indicator-000);
$checkbox-box-shadow-focus: 0 0 0 3px var(--color-indicator-000);
$checkbox-box-shadow-danger: 0 0 0 3px var(--color-danger);
$checkbox-box-shadow-readonly: 0 0 0 0 var(--color-indicator-000);
$checkbox-border-radius: $border-radius;

$icon-check-img: '../../assets/bouzu-ui/icons/check.svg';

#{$cn} {
	width: auto;

	&._disabled {
		pointer-events: none;
		opacity: 0.5;
	}

	// checkbox のスタイルをinclude
	&-input {
		// display:none だと tabindex が効かなくなるため、
		// 効かすようにする施策
		appearance: none; // ブラウザのデフォルトのスタイルを削除
		position: absolute; // レイアウトから無視
		opacity: 0; // 見えないようにする

		&-handle {
			position: relative;
			display: inline-flex;
			align-items: center;
			transition: all 0.25s ease;
			cursor: pointer;
			user-select: none;
		}

		&:hover+#{$cn}-handle {
			&::before {
				background-color: $checkbox-bg-color-hover;
				border: $checkbox-border-hover;
				box-shadow: $checkbox-box-shadow-hover;
			}
		}

		&:focus+#{$cn}-handle {
			&::before {
				background-color: $checkbox-bg-color-focus;
				border: $checkbox-border-focus;
				box-shadow: $checkbox-box-shadow-focus;
			}
		}

		&:checked+#{$cn}-handle {
			&::before {
				background-color: $checkbox-bg-color-checked;
				border: $checkbox-border-checked;
			}

			&::after {
				opacity: 1;
			}
		}
	}

	&-handle {
		position: relative;

		// 四角形
		&::before {
			content: '';
			display: block;
			width: $checkbox-rect-size;
			min-width: $checkbox-rect-size;
			height: $checkbox-rect-size;
			min-height: $checkbox-rect-size;
			border-radius: $checkbox-border-radius;
			border: $checkbox-border-default;
			outline: none;
			box-shadow: $checkbox-box-shadow-default;
			background-color: $checkbox-bg-color-default;
			transition: all 0.25s ease;
		}

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: $checkbox-rect-size;
			min-width: $checkbox-rect-size;
			height: $checkbox-rect-size;
			min-height: $checkbox-rect-size;
			display: block;
			mask-image: url($icon-check-img);
			mask-size: 64%;
			mask-repeat: no-repeat;
			mask-position: center;
			background-color: $checkbox-icon-color;
			opacity: 0;
			transition: all 0.25s ease;
		}
	}

	&-label {
		padding-top: 1px;
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

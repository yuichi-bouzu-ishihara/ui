<template>
	<div class="checkbox" :class="classes">
		<input :id="getId" ref="field" v-model="flag" type="checkbox" v-bind="{ name, disabled }">
		<label v-if="hasLabel" class="checkbox-label" :for="getId">{{ label }}</label>
		<Typography v-if="$slots.default" tag="label" :for="getId" class="checkbox-label" caption2 unselectable>
			<slot />
		</Typography>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { useSlots, watch } from 'vue'
import Typography from '../elements/Typography.vue'

// Props ////////////////////////
const props = defineProps({
	modelValue: { type: Boolean, default: false }, // v-model で受け取る値
	name: { type: String, default: 'check', required: true },
	label: { type: String, default: '' },
	color: { type: String, default: '' },

	// サイズ
	medium: { type: Boolean, default: false },
	small: { type: Boolean, default: false },

	disabled: { type: Boolean, default: false }, // 入力無効かどうか
})

// Data ---------------------------
const field: Ref<HTMLInputElement | null> = ref(null)
const getId: string = `checkbox-${props.name}`
const size = ref<string>('')

// Emits ////////////////////////
// イベント名と、オプションでそのイベントが送信するデータの型を定義します
const emit = defineEmits<{
	(event: 'update:modelValue', flag: boolean): void
}>()

// Computed ////////////////////////
const classes = computed(() => {
	const obj: {
		_disabled: boolean
		[key: string]: boolean
	} = {
		_disabled: props.disabled,
	}
	// チェックボックスの色指定があれば
	if (props.color) {
		// あった時
		obj[`_${props.color}`] = true // クラスを追加する
	}
	// サイズのクラスを追加する
	obj[`_${size.value}`] = true
	return obj
})
const flag = computed({
	get: () => props.modelValue,
	set: (value) => {
		// 値に変更があると呼ばれるsetter
		emit('update:modelValue', value)
	},
})
const hasLabel = computed(() => {
	let flag = props.label.length > 0
	if (!useSlots().default) {
		flag = true
	}
	return flag
})

// Watch -----------------------------------
// Props のサイズの変更を監視する
watch(
	[() => props.medium, () => props.small],
	([newMedium, newSmall]) => {
		// 優先度を文字列で type に設定する。
		if (newMedium) size.value = 'medium'
		if (newSmall) size.value = 'small'
		// 設定されていない場合は、 medium を設定する。
		if (!size.value) {
			size.value = 'medium'
		}
	},
	{ immediate: true }, // props の初期値を監視するために immediate を true にする。
)
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

$checkbox-font-size-small: 11px;
$checkbox-font-size-medium: 13px;
$checkbox-rect-size-small: 16px;
$checkbox-rect-size-medium: 24px;
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

@include mix.component-styles($cn) using ($mode) {

	@if $mode =='base' {
		width: auto;

		&._disabled {
			pointer-events: none;
			opacity: 0.5;
		}

		// checkbox のスタイルをinclude
		input[type='checkbox'] {
			// display:none だと tabindex が効かなくなるため、
			// 効かすようにする施策
			appearance: none; // ブラウザのデフォルトのスタイルを削除
			position: absolute; // レイアウトから無視
			opacity: 0; // 見えないようにする

			&+label {
				position: relative;
				display: inline-flex;
				align-items: center;
				transition: all 0.25s ease;
				cursor: pointer;
				user-select: none;

				// 四角形
				&::before {
					content: '';
					display: inline-block;
					vertical-align: middle;
					width: $checkbox-rect-size-medium;
					height: $checkbox-rect-size-medium;
					border-radius: $checkbox-border-radius;
					border: $checkbox-border-default;
					outline: none;
					box-shadow: $checkbox-box-shadow-default;
					background-color: $checkbox-bg-color-default;
					margin-right: 1.2em;
					transition: all 0.25s ease;
				}

				&::after {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					width: $checkbox-rect-size-medium;
					height: $checkbox-rect-size-medium;
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

			&:hover+label {
				&::before {
					background-color: $checkbox-bg-color-hover;
					border: $checkbox-border-hover;
					box-shadow: $checkbox-box-shadow-hover;
				}
			}

			&:focus+label {
				&::before {
					background-color: $checkbox-bg-color-focus;
					border: $checkbox-border-focus;
					box-shadow: $checkbox-box-shadow-focus;
				}
			}

			&:checked+label {
				&::before {
					background-color: $checkbox-bg-color-checked;
					border: $checkbox-border-checked;
				}

				&::after {
					opacity: 1;
				}
			}

			&:disabled {
				opacity: 0.5;
			}
		}

		// サイズ別のスタイル
		&._small input[type='checkbox']+label {

			// 四角形
			&::before {
				width: $checkbox-rect-size-small;
				height: $checkbox-rect-size-small;
			}

			&::after {
				width: $checkbox-rect-size-small;
				height: $checkbox-rect-size-small;
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

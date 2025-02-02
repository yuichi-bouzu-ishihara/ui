<template>
	<div class="select" :class="classes">
		<select :id="getId" ref="field" v-model="value" class="select-field"
			v-bind="{ name, placeholder, required, disabled, autocomplete }" @focus="onFocus" @blur="onBlur"
			@mouseover="isHover = true" @mouseleave="isHover = false">
			<option v-for="(item, index) in options" :key="`option-${getId}-${index}`" :value="item.value"
				:disabled="!item.value || item.disabled">
				{{ optionName(item.value, item.name) }}
			</option>
		</select>
		<Typography v-if="label" tag="label" :for="getId" class="select-label">
			<span class="select-label-inner">{{ label
				}}</span><span v-if="required" class="select-label-required">*</span>
		</Typography>
		<Icon v-if="!disabled" class="select-icon" name="arrowDown" size="12" />
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue'
import Typography from '../elements/Typography.vue'
import Icon from '../elements/Icon.vue'

// options > option の定義
interface Option {
	value: string // Placeholderとして利用する 「''」 は指定しないでください。 Placeholder は placeholder で指定してください。
	name?: string // name を省いた場合、value が表示される
	disabled?: boolean
}

/**
 * Props の定義
 */
const props = defineProps({
	// v-model で受け取る値
	modelValue: { type: String, default: '' },

	name: { type: String, default: '' },
	label: { type: String, default: '' },
	placeholder: { type: String, default: '' },
	description: { type: String, default: '' },
	fail: { type: String, default: '' },
	autocomplete: { type: String, default: 'off' }, // 自動補完
	caption: { type: String, default: '' }, // 右下に表示する文字数や禁止文字などの表示文言
	required: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
	readonly: { type: Boolean, default: false },
	focus: { type: Boolean, default: false }, // フォーカスをあてる

	options: { type: Array as () => Option[], default: () => [] }, // 選択肢の配列
})

const field: Ref<HTMLInputElement | null> = ref(null)
const getId: string = `input-${props.name}`
const validationMessage: Ref<string> = ref('')
const validation: Ref<boolean> = ref(true) // バリデーションの結果。初期値は true

/**
 * Emitの定義
 */
// イベント名と、オプションでそのイベントが送信するデータの型を定義します
const emit = defineEmits({
	['update:modelValue']: (_value: string) => true,
	['valid']: () => true,
	['invalid']: (_message: string) => true,
	['focus']: () => true,
	['blur']: () => true,
})

// Data -------------------------------------------
const isFocus = ref(false) // フォーカスがあたっているかどうか
const isHover = ref(false)

/**
 * Computed 定義
 */
// 値
const value = computed({
	get: () => props.modelValue,
	set: (value) => {
		// 値に変更があると呼ばれるsetter
		emit('update:modelValue', value)
		if (value) {
			emit('valid')
		}
		else {
			emit('invalid')
		}
	},
})
// クラス名
const classes = computed(() => {
	return {
		_focus: isFocus.value,
		_input: value.value.length, // 入力があれば
		_readonly: props.readonly, // 読み取り専用
		_noLabel: !props.label, // ラベルがなければ
		_disabled: props.disabled, // 無効化されていれば
		_invalid: validation.value === false, // バリデーションが false なら、_invalidをつける。 required が true な時のみ動作する。
	}
})

/**
 * Watch 定義
 */
watch(
	() => props.focus,
	(newFocusValue, oldFocusValue) => {
		if (field.value) {
			if (newFocusValue) {
				field.value.focus()
			}
			else {
				field.value.blur()
			}
		}
	},
)

/**
 * Methods 定義
 */
// フォーカスイベント
const onFocus = () => {
	isFocus.value = true
	emit('focus')
}
// フォーカスが外れたイベント
const onBlur = () => {
	if (props.required && value.value.length === 0) {
		validationMessage.value = '選択してください'
		validation.value = false
	}
	else {
		validationMessage.value = ''
		validation.value = true
	}
	isFocus.value = false
	emit('blur')
}
// Option の表示名
const optionName = (value: string, name?: string) => {
	let txt = name
	if (!txt) {
		txt = value
	}
	return txt
}
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.select'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		width: 100%;
		padding-top: func.get-size(14);

		&-field {
			// input スタイル初期化
			appearance: none;
			border: none;
			outline: none;
			background: none;
			padding: 0;

			// フォント関連スタイルをすべて継承する
			font: inherit;
			font-size: inherit;
			line-height: inherit;
			font-weight: inherit;
			font-style: inherit;
			font-variant: inherit;
			text-transform: inherit;
			text-decoration: inherit;
			letter-spacing: inherit;
			word-spacing: inherit;
			text-indent: inherit;
			text-shadow: inherit;
			text-align: inherit;

			color: var(--color-dark);
			width: 100%;
			padding-top: 0.2em;
			padding-bottom: 0.36em;

			// プレースホルダーを非表示にする
			&::placeholder {
				color: rgba(var(--color-dark), 0);
			}

			&:-webkit-autofill,
			&:-webkit-autofill:hover,
			&:-webkit-autofill:focus,
			&:-webkit-autofill:active,
			&:-internal-autofill-selected {
				-webkit-text-fill-color: var(--color-dark) !important;
				-webkit-box-shadow: 0 0 0px 1000px var(--color-light) inset !important;
				background-color: transparent !important;
			}
		}

		&-label {
			// フォント関連スタイルをすべて継承する
			font: inherit;
			font-size: inherit;
			line-height: inherit;
			font-weight: inherit;
			font-style: inherit;
			font-variant: inherit;
			text-transform: inherit;
			text-decoration: inherit;
			letter-spacing: inherit;
			word-spacing: inherit;
			text-indent: inherit;
			text-shadow: inherit;
			text-align: inherit;
			color: var(--color-dark);

			display: block;
			position: absolute;
			top: 0;
			left: 0;
			transform: translate(0em, 0.8em);
			transform-origin: top left;
			transition: all 0.15s ease-out;
			pointer-events: none;

			&-inner {
				font-size: inherit;
				opacity: 0.3;
			}

			&-required {
				line-height: 1;
				color: var(--color-danger);
				vertical-align: middle;
				padding-left: 0.1em;
			}
		}

		&-icon {
			position: absolute;
			right: func.get-size(4);
			bottom: .8em;
			margin: auto;
			opacity: .3;
		}

		// ラベルがない時は、 placeholder を表示する
		&._noLabel {
			padding-top: 0;

			#{$cn}-field {
				&::placeholder {
					color: var(--color-dark-030);
				}
			}
		}

		&:hover:not(._disabled) {
			#{$cn}-field {

				// プレースホルダーを表示する
				&::placeholder {
					color: var(--color-dark-060);
				}
			}

			#{$cn}-label {
				&-inner {
					opacity: .6;
				}
			}

			#{$cn}-icon {
				opacity: 1;
			}
		}

		&._focus {
			#{$cn}-field {

				// プレースホルダーを表示する
				&::placeholder {
					color: var(--color-dark-030);
				}
			}

			#{$cn}-label {
				font-family: var(--typography-font-family-bold);
				font-weight: bold;
				font-size: func.get-size(10);
				transform: translate(0em, 0em);

				&-inner {
					opacity: 1;
				}
			}

			#{$cn}-icon {
				opacity: 1;
			}
		}

		&._input {
			#{$cn}-label {
				font-size: func.get-size(10);
				transform: translate(0em, 0em);

				&-inner {
					opacity: 1 !important;
				}
			}
		}

		&._invalid {
			#{$cn}-label {
				color: var(--color-danger);
			}
		}

		&._readonly,
		&._disabled {
			pointer-events: none;
			cursor: default;

			#{$cn}-field,
			#{$cn}-label {
				opacity: 0.6;
				cursor: default;
			}
		}
	}

	@if $mode =='darkmode' {
		&-field {
			color: var(--color-light);

			&:-webkit-autofill,
			&:-webkit-autofill:hover,
			&:-webkit-autofill:focus,
			&:-webkit-autofill:active,
			&:-internal-autofill-selected {
				-webkit-text-fill-color: var(--color-light) !important;
				-webkit-box-shadow: 0 0 0px 1000px var(--color-darkblack) inset !important;
				background-color: transparent !important;
			}
		}

		&-label {
			color: var(--color-light);
		}

		// ラベルがない時は、 placeholder を表示する
		&._noLabel {

			#{$cn}-field {
				&::placeholder {
					color: var(--color-light-030);
				}
			}
		}

		&:hover:not(._disabled) {
			#{$cn}-field {

				// プレースホルダーを表示する
				&::placeholder {
					color: var(--color-light-060);
				}
			}
		}

		&._focus {
			#{$cn}-field {

				// プレースホルダーを表示する
				&::placeholder {
					color: var(--color-light-030);
				}
			}
		}
	}

	@if $mode =='auto' {
		padding-top: func.get-size(14, false);

		&-icon {
			right: func.get-size(4, false);
		}

		&._focus {
			#{$cn}-label {
				font-size: func.get-size(10, false);
			}
		}

		&._input {
			#{$cn}-label {
				font-size: func.get-size(10, false);
			}
		}
	}
}
</style>

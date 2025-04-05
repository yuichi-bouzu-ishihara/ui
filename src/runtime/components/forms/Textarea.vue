<template>
	<div class="textarea" :class="classes">
		<div class="textarea-inner" :data-value="autoheight ? text : ''" :style="{ maxHeight }">
			<textarea :id="getId" ref="fieldEl" v-model="text" v-focus="focus" class="textarea-inner-field"
				:placeholder="placeholderText" v-bind="{ name, readonly, rows }" @input="handleInput" @keydown="handleKeydown"
				@focus="handleFocus" @blur="handleBlur" @mouseover="isHover = true" @mouseleave="isHover = false" />
		</div>
		<Typography v-if="label" tag="label" :for="getId" class="textarea-label">
			<span class="textarea-label-inner">{{ label
			}}</span><span v-if="required" class="textarea-label-required">*</span>
		</Typography>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import Typography from '../elements/Typography.vue'
import { useRegex } from '../../composables/regex'

// Composables -------------------------------------------
const { noOnlySpace } = useRegex()

// Props -------------------------------------------
const props = defineProps({
	name: { type: String, required: true },
	type: { type: String, default: 'text' },
	label: { type: String, default: '' }, // 通常時は Placeholder になり、focus 時は上に移動してラベルとなる
	placeholder: { type: String, default: '' },
	description: { type: String, default: '' },
	modelValue: { type: String, default: '' },
	autocomplete: { type: Boolean, default: false }, // 自動補完
	autoheight: { type: Boolean, default: true }, // 高さを自動調整

	pattern: { type: String }, // 入力制限があれば。defaultは設定しなければ設定すらされないので、設定していない。
	maxlength: { type: [Number, String] },
	rows: { type: [Number, String], default: 1 },
	maxRows: { type: [Number, String], default: null }, // 最大行数
	required: { type: Boolean, default: false },
	readonly: { type: Boolean, default: false },
	focus: { type: Boolean, default: false }, // フォーカスをあてる。 Page mounted 後に true にするとフォーカスがあたる。
	nowrap: { type: Boolean, default: false }, // 改行を許可しない
	noBorder: { type: Boolean, default: false }, // ボーダーを表示しない

	// バリデーションのタイミング設定
	validation: {
		type: String,
		default: 'blur', // デフォルトは blur 時。
		validator: (value: string) => ['always', 'blur'].includes(value), // 'always'または'blur'のみ許可します
	},
})

// Emits -------------------------------------------
const emit = defineEmits<{
	(e: 'update:modelValue' | 'invalid', textOrMessage: string): void
	(e: 'enter-key-down' | 'valid' | 'focus' | 'blur'): void
}>()

// Data -------------------------------------------
const state = ref('idle') // idle, valid, invalid
const isFocus = ref(false) // フォーカスがあたっているかどうか
const isHover = ref(false)
const getId: string = `textarea-${props.name}`
const validationMessage = ref('')
const fieldEl = ref<HTMLTextAreaElement | null>(null)
const lineHeight = ref<number | null>(null)

// Computed -------------------------------------------
const classes = computed(() => {
	return {
		[`_${state.value}`]: true,
		_focus: isFocus.value,
		_input: text.value.length, // 入力があれば
		_noLabel: !props.label, // ラベルがなければ
		_readonly: props.readonly, // 読み取り専用
		_maxHeight: props.maxRows ? true : false, // 最大行数が設定されているかどうか
	}
})
// 入力文字
const text = computed({
	get: () => props.modelValue,
	set: (value) => {
		// 値に変更があると呼ばれるsetter
		emit('update:modelValue', value)
	},
})
const placeholderText = computed(() => {
	if (isFocus.value || !props.label) {
		return props.placeholder
	}
	return ''
})
const maxHeight = computed(() => {
	if (props.maxRows && lineHeight.value !== null) {
		return `${lineHeight.value * Number.parseInt(String(props.maxRows))}px`
	}
	return 'none'
})

// watch the v-model for changes and run validation
watch(
	() => props.modelValue,
	() => {
		if (props.validation === 'always') {
			validate()
		}
	},
)

// Methods -------------------------------------------
const handleInput = () => {
	if (fieldEl.value && props.autoheight) {
		fieldEl.value.style.height = 'auto' // 高さをリセット
		fieldEl.value.style.height = `${fieldEl.value.scrollHeight}px` // 内容に基づいて高さを設定
	}
}
const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		// 改行を許可しない時
		if (props.nowrap) {
			// デフォルトの動作（新しい行を追加する）を停止
			event.preventDefault()
		}
	}
}
const handleFocus = () => {
	isFocus.value = true
	emit('focus')
}
const handleBlur = () => {
	if (props.validation === 'blur') {
		validate()
	}
	isFocus.value = false
	emit('blur')
}
const validate = () => {
	let message = ''
	if (text.value === '' && props.required) {
		message = `${props.placeholder ? `${props.placeholder}を` : ''}入力してください。`
	}
	if (!message && props.maxlength) {
		if (text.value.length > Number.parseInt(String(props.maxlength))) {
			message = `${props.maxlength}文字以内で入力してください。現在${text.value.length}文字です。`
		}
	}
	if (!message && text.value !== '' && text.value.match(noOnlySpace)) {
		message = '空白のみの入力はできません。'
	}

	if (!message) {
		state.value = 'valid'
		emit('valid')
		validationMessage.value = ''
	}
	else {
		state.value = 'invalid'
		emit('invalid', message)
		validationMessage.value = message
	}
}

// Lifecycle Hooks -------------------------------------------
onMounted(async () => {
	await nextTick()
	if (text.value) {
		validate()
	}
	if (fieldEl.value) {
		const computedStyle = window.getComputedStyle(fieldEl.value)
		lineHeight.value = Number.parseFloat(computedStyle.lineHeight)
		if (props.autoheight) {
			fieldEl.value.style.height = 'auto' // 初期高さをリセット
			fieldEl.value.style.height = `${fieldEl.value.scrollHeight}px` // 内容に基づいて高さを設定
		}
	}
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.textarea'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		width: 100%;
		padding-top: 14px;

		&-inner {
			width: 100%;
			text-align: inherit;
			white-space: pre-wrap;
			word-break: break-all;

			// 自動で width と height を伸ばす施策 /////////////
			// 参考：https://css-tricks.com/auto-growing-inputs-textareas/
			display: inline-grid;
			vertical-align: top;
			align-items: stretch;
			position: relative;
			color: var(--color-text);

			&::after,
			&-field {
				// textarea スタイル初期化
				appearance: none;
				border: none;
				outline: none;
				background: none;
				padding: 0;
				resize: none; // リサイズ不可

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
				color: inherit;

				width: auto;
				min-width: 1em;
				grid-area: 2 / 1;
				margin: 0;
				min-height: 100%;
				padding-top: 0.2em;
				padding-bottom: 0.36em;

				// プレースホルダーを非表示にする
				&::placeholder {
					color: var(--color-text-000);
				}
			}

			&::after {
				content: attr(data-value) ' ';
				visibility: hidden;
			}

			/////////////////////////////////////////
		}

		#{$cn}-label {
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
			color: var(--color-text-030);

			display: block;
			position: absolute;
			top: 0;
			left: 0;
			transform: translate(0em, 0.64em);
			transform-origin: top left;
			transition: var.$transition-base;
			pointer-events: none;

			&-inner {
				font-size: inherit;
				transition: color var.$transition-base-duration var.$transition-base-timing-function;
				// opacity: 0.3;
			}

			&-required {
				line-height: 1;
				color: var(--color-danger);
				vertical-align: middle;
				padding-left: 0.1em;
			}
		}

		&:hover:not(._disabled):not(._readonly):not(._focus) {
			#{$cn}-label {
				&-inner {
					color: var(--color-text-060);
				}
			}

			&._noLabel {
				#{$cn}-field {

					// プレースホルダー
					&::placeholder {
						color: var(--color-text-060);
					}
				}
			}
		}

		// ラベルがない時は、 placeholder を表示する
		&._noLabel {
			padding-top: 0;

			#{$cn}-field {
				&::placeholder {
					color: var(--color-text-030);
				}
			}
		}

		&._focus {
			#{$cn}-field {

				// プレースホルダーを表示する
				&::placeholder {
					color: var(--color-text-030);
				}
			}

			#{$cn}-label {
				font-weight: bold;
				font-size: 10px;
				transform: translate(0em, 0em);

				&-inner {
					color: var(--color-text);
				}
			}
		}

		&._input {
			#{$cn}-label {
				font-size: 10px;
				transform: translate(0em, 0em);

				&-inner {
					opacity: 1 !important;
				}
			}
		}

		&._invalid {
			#{$cn}-label {
				color: var(--color-danger) !important;
			}
		}

		&._readonly,
		&._disabled {
			pointer-events: none;
			cursor: default;

			#{$cn}-field,
			#{$cn}-label {
				opacity: 0.6;
			}
		}

		&._noSpin {

			#{$cn}-field[type="number"]::-webkit-inner-spin-button,
			#{$cn}-field[type="number"]::-webkit-outer-spin-button {
				-webkit-appearance: none;
				margin: 0;
				-moz-appearance: textfield;
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

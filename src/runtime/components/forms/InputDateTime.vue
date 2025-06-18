<template>
	<div class="inputDateTime" :class="classes">
		<!-- 値が空でフォーカスされていない場合はプレースホルダーテキストを表示 -->
		<div v-if="!text && !isFocus" class="inputDateTime-placeholder" @click="focusInput">
			{{ placeholder || '日時を選択してください' }}
		</div>
		<!-- 値がある場合またはフォーカス時はinput要素を表示 -->
		<input v-else :id="getId" ref="fieldEl" v-model="text" v-focus="focus" class="inputDateTime-field"
			type="datetime-local"
			v-bind="{ name, placeholder, required, readonly, disabled, autocomplete, pattern, maxlength }"
			:autocomplete="autocomplete ? 'on' : 'off'" :maxlength="limitlength" @input="handleInput" @keydown="handleKeydown"
			@focus="handleFocus" @blur="handleBlur" @mouseover="isHover = true" @mouseleave="isHover = false">
		<Typography v-if="label" tag="label" :for="getId" class="inputDateTime-label">
			<span class="inputDateTime-label-inner">{{ label
			}}</span><span v-if="required" class="inputDateTime-label-required">*</span>
		</Typography>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRegex } from '../../composables/regex'
import { useUtils } from '../../composables/utils'
import Typography from '../elements/Typography.vue'

// Composables -------------------------------------------
const { noOnlySpace } = useRegex()

// Props -------------------------------------------
const props = defineProps({
	name: { type: String, required: true },
	type: { type: String, default: 'text' },
	label: { type: String, default: '' }, // 通常時は Placeholder になり、focus 時は上に移動してラベルとなる
	placeholder: { type: String, default: '' },
	modelValue: { type: String, default: '' },
	autocomplete: { type: Boolean, default: false }, // 自動補完

	pattern: { type: String }, // 入力制限があれば。defaultは設定しなければ設定すらされないので、設定していない。
	patternMismatchMessage: { type: String, default: '入力形式が正しくありません。' }, // パターンにマッチしなかった時のメッセージ

	maxlength: { type: [Number, String] },
	limitlength: { type: [Number, String] }, // 文字数上限。 maxlength とは違い、指定文字数以上入力できなくなる。
	required: { type: Boolean, default: false },
	focus: { type: Boolean, default: false }, // フォーカスをあてる

	/**
	 * readonly と disabled の違いは下記を参考
	 * @see https://blog1.mammb.com/entry/2020/01/05/090000
	 */
	readonly: { type: Boolean, default: false }, // 読み取り専用
	disabled: { type: Boolean, default: false }, // 無効化
	noSpin: { type: Boolean, default: false }, // 数字入力の上下ボタン非表示

	// バリデーションのタイミング設定
	validation: {
		type: String,
		default: 'blur', // デフォルトは blur 時。
		validator: (value: string) => ['always', 'blur'].includes(value), // 'always'または'blur'のみ許可します
	},
})

// Emits -------------------------------------------
const emit = defineEmits({
	['update:modelValue']: (_text: string) => true,
	['enter-key-down']: () => true,
	['valid']: () => true,
	['invalid']: (_message: string) => true,
	['focus']: () => true,
	['blur']: () => true,
})

// Data -------------------------------------------
const state = ref('idle') // idle, valid, invalid
const fieldEl = ref<HTMLInputElement | null>(null) // input要素
const isFocus = ref(props.focus) // フォーカスがあたっているかどうか
const isHover = ref(false)
const getId: string = `input-${props.name}`
const validationMessage = ref('')

// Computed -------------------------------------------
const classes = computed(() => {
	return {
		[`_${state.value}`]: true,
		_focus: isFocus.value,
		_input: text.value.length, // 入力があれば
		_readonly: props.readonly, // 読み取り専用
		_noLabel: !props.label, // ラベルがなければ
		_disabled: props.disabled, // 無効化されていれば
		_noSpin: props.noSpin, // 数字入力の上下ボタン非表示
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

// watch the v-model for changes and run validation
watch(
	() => props.modelValue,
	() => {
		if (props.validation === 'always') {
			validate()
		}
		else if (validationMessage.value) {
			// バリデーションメッセージがある == 入力内容に不備がある場合、再度バリデーションを実行
			validate()
		}
	},
)

// Methods -------------------------------------------
const handleInput = () => { }
const handleKeydown = () => { }
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
const focusInput = async () => {
	isFocus.value = true
	emit('focus')
	await nextTick()
	await useUtils().wait(100)
	fieldEl.value?.showPicker()
}
const validate = () => {
	let message = ''

	if (text.value === '' && props.required) {
		message = `${props.label ? `${props.label}を` : `${props.placeholder}を`}入力してください。`
	}
	if (!message && props.maxlength) {
		if (text.value.length > Number.parseInt(String(props.maxlength))) {
			message = `${props.maxlength}文字以内で入力してください。現在${text.value.length}文字です。`
		}
	}
	if (!message && text.value !== '' && text.value.match(noOnlySpace)) {
		message = '空白のみの入力はできません。'
	}
	if (!message && props.pattern && !new RegExp(props.pattern).test(text.value)) {
		message = props.patternMismatchMessage
	}
	// 入力がなく、必須でもない場合は、メッセージなし。
	if (text.value === '' && !props.required) {
		message = ''
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
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.inputDateTime'; // コンポーネントセレクタ名

#{$cn} {
	position: relative;
	width: 100%;
	padding-top: 14px;

	#{$cn}-field {
		// input スタイル初期化
		appearance: none;
		border: none;
		outline: none;
		background: none;
		padding: 0;

		/* アイコンのスペースを確保 */
		padding-right: 40px;

		&::-webkit-calendar-picker-indicator {
			opacity: 0;
			position: absolute;
			right: 0;
			top: 0;
			width: 100%;
			height: 100%;
			cursor: pointer;
		}

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

		color: var(--color-text);
		width: 100%;
		padding-top: 0.2em;
		padding-bottom: 0.36em;

		// プレースホルダーを非表示にする
		&::placeholder {
			color: var(--color-text-000);
			transition: var.$transition-base;
		}

		&:-webkit-autofill,
		&:-webkit-autofill:hover,
		&:-webkit-autofill:focus,
		&:-webkit-autofill:active,
		&:-internal-autofill-selected {
			-webkit-text-fill-color: var(--color-text) !important;
			-webkit-box-shadow: 0 0 0px 1000px var(--color-background) inset !important;
			background-color: transparent !important;
		}
	}

	#{$cn}-placeholder {
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
		width: 100%;
		padding-top: 0.2em;
		padding-bottom: 0.36em;
		padding-right: 40px;
		cursor: pointer;
		transition: var.$transition-base;
		opacity: 0;

		&:hover:not(._disabled):not(._readonly) {
			color: var(--color-text-060);
		}
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

		#{$cn}-placeholder {
			opacity: 1;
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

		&:hover:not(._disabled):not(._readonly):not(._focus) {
			#{$cn}-label {
				&-inner {
					color: var(--color-danger-060);
				}
			}

			&._noLabel {
				#{$cn}-field {

					// プレースホルダー
					&::placeholder {
						color: var(--color-danger-060);
					}
				}
			}
		}
	}

	&._readonly,
	&._disabled {
		pointer-events: none;
		cursor: default;

		#{$cn}-field,
		#{$cn}-label,
		#{$cn}-placeholder {
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
</style>

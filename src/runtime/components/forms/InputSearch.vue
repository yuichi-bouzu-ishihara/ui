<template>
	<div class="inputSearch" :class="classes">
		<Icon class="inputSearch-icon" name="search" size="1.2em" />
		<input :id="getId" ref="fieldEl" v-model="text" v-focus="focus" class="inputSearch-field" type="search"
			:autocomplete="autocomplete ? 'on' : 'off'" :maxlength="limitlength" v-bind="{ name, placeholder, pattern }"
			@input="handleInput" @keydown="handleKeydown" @focus="handleFocus" @blur="handleBlur" @mouseover="isHover = true"
			@mouseleave="isHover = false">
		<template v-if="clear && text">
			<IconButton class="inputSearch-clear" :icon="{ name: 'cross', size: 12 }" minimal w="1.6em" @click="text = ''" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRegex } from '../../composables/regex'
import Icon from '../elements/Icon.vue'
import IconButton from '../elements/IconButton.vue'

// Composables -------------------------------------------
const regex = useRegex()

// Props -------------------------------------------
const props = defineProps({
	name: { type: String, default: 'search' },
	placeholder: { type: String, default: '' },
	modelValue: { type: String, default: '' },
	autocomplete: { type: Boolean, default: false }, // 自動補完
	clear: { type: Boolean, default: false }, // クリアボタンを表示するかどうか

	pattern: { type: String, default: '' }, // 入力制限があれば。defaultは設定しなければ設定すらされないので、設定していない。
	patternMismatchMessage: { type: String, default: '入力形式が正しくありません。' }, // パターンにマッチしなかった時のメッセージ

	maxlength: { type: [Number, String], default: '' },
	limitlength: { type: [Number, String], default: '' }, // 文字数上限。 maxlength とは違い、指定文字数以上入力できなくなる。
	focus: { type: Boolean, default: false }, // フォーカスをあてる

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
		_clear: props.clear, // クリアボタンを表示するかどうか
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
const validate = () => {
	let message = ''

	if (!message && props.maxlength) {
		if (text.value.length > Number.parseInt(String(props.maxlength))) {
			message = `${props.maxlength}文字以内で入力してください。現在${text.value.length}文字です。`
		}
	}
	if (!message && text.value !== '' && text.value.match(regex.noOnlySpace)) {
		message = '空白のみの入力はできません。'
	}
	if (!message && props.pattern && !new RegExp(props.pattern).test(text.value)) {
		message = props.patternMismatchMessage
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
	if (text.value) {
		validate()
	}
})
</script>

<style lang="scss">
$cn: '.inputSearch'; // コンポーネントクラス名

#{$cn} {
	position: relative;
	width: 100%;
	display: flex;
	align-items: center;
	gap: 0.8em;

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

		color: var(--color-text);
		width: 100%;
		// padding-top: 0.2em;
		// padding-bottom: 0.2em;

		// プレースホルダーを非表示にする
		&::placeholder {
			color: var(--color-text-030);
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

		// クリアボタンを非表示にする
		&::-webkit-search-cancel-button {
			display: none;
		}
	}

	&-clear {
		position: absolute;
		top: 0;
		bottom: 0;
		right: -.4em;
		margin: auto;
	}

	&-icon {
		transform: translateY(0.1em);
		opacity: .3;
	}

	&._focus {
		#{$cn}-field {

			// プレースホルダーを表示する
			&::placeholder {
				color: var(--color-text-030);
			}
		}

		#{$cn}-icon {
			opacity: 1;
		}
	}

	&._clear {
		#{$cn}-field {
			padding-right: 1.6em;
		}
	}
}
</style>

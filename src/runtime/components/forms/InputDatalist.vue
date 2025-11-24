<template>
	<div class="inputDatalist" :class="classes" :style="{ '--per-view': perView }" tabindex="0"
		@keydown.up.prevent="handleUp" @keydown.down.prevent="handleDown" @keydown.enter.prevent="handleHit">
		<input :id="getId" v-model="selectedOption" v-focus="focus" class="inputDatalist-field" type="text"
			v-bind="{ name, placeholder }" :autocomplete="autocomplete ? 'on' : 'off'" @input="handleInput"
			@focus="handleFocus" @blur="handleBlur" @mouseover="isHover = true" @mouseleave="isHover = false">
		<Typography tag="label" :for="getId" class="inputDatalist-label" inherit lineclamp="1">
			<span class="inputDatalist-label-inner">{{ label }}</span><span v-if="required"
				class="inputDatalist-label-required">*</span>
		</Typography>
		<FieldFooter v-resize="(rect: DOMRectReadOnly) => footerHeight = rect.height"
			v-bind="{ fail: validationMessage.length > 0, focus: (isHover || isFocus) && !readonly, message: message || validationMessage }" />
		<div class="inputDatalist-list" :style="{ bottom: `${footerHeight - 0.5}px` }">
			<ul v-show="expand && list.length" ref="listEl" class="inputDatalist-list-inner"
				:style="{ maxHeight: `${listItemHeight * Number(perView)}px` }">
				<More :disabled="!moreFlag" :loading="processing" gap="0" loader-height="44" loader-icon-size="12"
					@reached="emit('more')">
					<Box v-for="(option, index) in filteredOptions" :key="option"
						v-resize="(rect: DOMRectReadOnly) => listItemHeight = rect.height" tag="li"
						class="inputDatalist-list-inner-item" :class="{ _active: active === index }" @mousedown.prevent
						@click.stop="selectOption(option)" @touchend.passive="selectOption(option)">
						{{ option }}
					</Box>
				</More>
			</ul>
			<template v-if="!list.length && processing">
				<div class="inputDatalist-border-loader">
					<Spinner size="12" color="text-060" />
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRegex } from '../../composables/regex'
import Typography from '../elements/Typography.vue'
import More from '../elements/More.vue'
import Spinner from '../elements/Spinner.vue'
import Box from '../layout/Box.vue'
import FieldFooter from '../forms/FieldFooter.vue'

// Composables -------------------------------------------
const regex = useRegex()

// Emits ---------------------
const emit = defineEmits(['update:modelValue', 'valid', 'invalid', 'focus', 'blur', 'select', 'more'])

// Props ---------------------
const props = defineProps({
	name: { type: String, required: true },
	type: { type: String, default: 'text' },
	label: { type: String, default: '' },
	placeholder: { type: String, default: '' },
	description: { type: String, default: '' },
	message: { type: String, default: '' }, // エラー・バリデーションメッセージ
	modelValue: { type: String, default: '' },
	autocomplete: { type: Boolean, default: false }, // 自動補完

	pattern: { type: String, default: '' }, // 入力制限があれば。defaultは設定しなければ設定すらされないので、設定していない。
	maxlength: { type: [Number, String], default: '' },
	required: { type: Boolean, default: false },
	readonly: { type: Boolean, default: false },
	focus: { type: Boolean, default: false }, // フォーカスをあてる

	// バリデーションのタイミング設定
	validation: {
		type: String,
		default: 'blur', // デフォルトは blur 時。
		validator: (value: string) => ['always', 'blur'].includes(value), // 'always'または'blur'のみ許可します
	},

	perView: { type: [Number, String], default: 3.5 },
	list: { type: Array as () => string[], default: () => [] },
	processing: { type: Boolean, default: false }, // list ロード処理中
	moreFlag: { type: Boolean, default: true }, // もっとみるが可能か
})

// Data ----------------------
const state = ref('idle') // idle, valid, invalid
const selectedOption = ref(props.modelValue)
const filteredOptions = ref<string[]>([])
const expand = ref(false)
const active = ref<number | null>(null)
const getId: string = `inputDatalist-${props.name}`
const isFocus = ref(false) // フォーカスがあたっているかどうか
const validationMessage = ref('')
const listEl = ref<HTMLElement | null>(null)
const listItemHeight = ref(0)
const isHover = ref(false)
const footerHeight = ref(0)

// Computed -------------------------------------------
const classes = computed(() => {
	return {
		[`_${state.value}`]: true,
		_focus: isFocus.value,
		_input: selectedOption.value.length, // 入力があれば
		_readonly: props.readonly, // 読み取り専用
		_noLabel: noLabel.value,
	}
})
const noLabel = computed(() => {
	return !props.label
})

// Watch -------------------------------------------
watch(
	() => props.list,
	(newVal) => {
		filteredOptions.value = newVal
	},
)
watch(selectedOption, (value) => {
	if (props.validation === 'always') {
		validate()
	}
	emit('update:modelValue', value)
})
watch(
	() => props.modelValue,
	(newVal) => {
		selectedOption.value = newVal
	},
)

// Methods -------------------------------------------
const filterOptions = () => {
	filteredOptions.value = props.list.filter(option =>
		option.toLowerCase().includes(selectedOption.value.toLowerCase()),
	)
	active.value = null
}
const selectOption = (option: string) => {
	// console.log('selectOption')
	emit('update:modelValue', option)
	emit('select', option)
	selectedOption.value = option
	hideOptions()
}
const hideOptions = () => {
	// console.log('hideOptions')
	expand.value = false
	active.value = null
}
const scrollIntoView = () => {
	if (listEl.value && active.value !== null) {
		const listItem = listEl.value.getElementsByTagName('li')[active.value] // Element内のすべての 'li' 子要素を取得します。
		if (listItem) {
			listItem.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'nearest',
			})
		}
	}
}
const handleUp = () => {
	// console.log('handleUp')
	if (active.value === null) {
		active.value = 0
	}
	else if (active.value > 0) {
		active.value--
	}
	nextTick(scrollIntoView)
}
const handleDown = () => {
	// console.log('handleDown')
	if (active.value === null) {
		active.value = 0
	}
	else if (active.value < filteredOptions.value.length - 1) {
		active.value++
	}
	nextTick(scrollIntoView)
}
const handleHit = () => {
	// console.log('handleHit')
	if (active.value !== null) {
		selectOption(filteredOptions.value[active.value])
	}
}
const handleInput = () => {
	// console.log('handleInput')
	expand.value = selectedOption.value.length > 0
	filterOptions()

	if (!selectedOption.value) {
		if (listEl.value) {
			listEl.value.scrollTop = 0
		}
	}
}
const handleFocus = () => {
	// console.log('handleFocus')
	isFocus.value = true
	expand.value = true
	emit('focus')
}
const handleBlur = () => {
	// console.log('handleBlur')
	if (props.validation === 'blur') {
		validate()
	}
	isFocus.value = false
	hideOptions()
	emit('blur')
}
const validate = () => {
	// console.log('validate')
	let msg = ''
	if (selectedOption.value === '' && props.required) {
		msg = '入力してください。'
	}
	if (!msg && props.maxlength) {
		if (selectedOption.value.length > Number.parseInt(String(props.maxlength))) {
			msg = `${props.maxlength}文字以内で入力してください。`
		}
	}
	if (!msg && props.required && selectedOption.value !== '' && selectedOption.value.match(regex.noOnlySpace)) {
		msg = '空白のみの入力はできません。'
	}

	if (!msg) {
		state.value = 'valid'
		emit('valid')
		validationMessage.value = ''
	}
	else {
		state.value = 'invalid'
		emit('invalid', msg)
		validationMessage.value = msg
	}
}

// Lifecycle Hooks -------------------------------------------
onMounted(() => {
	filteredOptions.value = props.list
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_functions.scss' as func;
@use '../../scss/_mixins.scss' as mix;
$cn: '.inputDatalist'; // コンポーネントクラス名

$datalist-padding-top: 8px;
$datalist-padding-bottom: 8px;

$item-padding-top: 4px;
$item-padding-right: 16px;
$item-padding-left: 16px;
$item-padding-bottom: 4px;
$item-font-size: 0.35em;
$item-font-size-min: 14px;

$perview: var(--per-view);

#{$cn} {
	position: relative;
	width: 100%;
	outline: none;
	padding-top: 14px;

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
		padding-top: 0.2em;
		padding-bottom: 0.28em;

		// プレースホルダーを非表示にする
		&::placeholder {
			color: var(--color-text-000);
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
		color: var(--color-text);

		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
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

	&-list {
		position: relative;
		width: 100%;

		&-inner {
			position: absolute;
			top: 100%;
			left: 0;
			z-index: 1;
			width: 100%;
			margin: 0;
			padding: 0;
			background-color: var(--color-text-005);
			backdrop-filter: blur(40px);
			overflow-y: auto;
			list-style: none;

			&-item {
				// フォント関連スタイルをすべて継承する
				font: inherit;
				font-size: max(#{$item-font-size}, #{$item-font-size-min});
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

				padding-top: $item-padding-top;
				padding-right: $item-padding-right;
				padding-left: $item-padding-left;
				padding-bottom: $item-padding-bottom;
				cursor: pointer;
				transition: var.$transition-base;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

				&:hover,
				&._active {
					opacity: 0.3;
				}

				&:first-child {
					padding-top: $item-padding-top + $datalist-padding-top;
				}

				&:last-child {
					padding-bottom: $item-padding-bottom + $datalist-padding-bottom;
				}
			}
		}

		&-loader {
			position: absolute;
			top: 100%;
			left: 0;
			z-index: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			margin: 0;
			padding: 16px;
			background-color: var(--color-text-05);
			backdrop-filter: blur(40px);
			overflow-y: auto;
			list-style: none;
		}
	}

	&._noLabel {
		padding-top: 0;
	}

	&:hover:not(._disabled):not(._readonly) {
		#{$cn}-label {
			&-inner {
				opacity: .6;
			}
		}

		&._noLabel {
			#{$cn}-field {

				// プレースホルダーを非表示にする
				&::placeholder {
					color: var(--color-text-030);
				}
			}
		}
	}

	&._focus {
		#{$cn}-label {
			font-size: 10px;
			transform: translate(0em, 0em);

			&-inner {
				opacity: 1 !important;
			}
		}

		#{$cn}-field {

			// プレースホルダーを非表示にする
			&::placeholder {
				color: var(--color-text-030);
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
</style>

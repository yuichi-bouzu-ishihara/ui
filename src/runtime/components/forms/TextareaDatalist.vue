<template>
	<div class="textareaDatalist" :class="classes" :style="styles" tabindex="0" @keydown="handleKeydown">
		<Textarea v-model="text" :name="`textareaDatalist-${getId}`" v-bind="{ label, placeholder, rows, focus }"
			@focus="handleFocus" @blur="handleBlur" @mouseover="isHover = true" @mouseleave="isHover = false" />
		<FieldFooter v-resize="(rect: DOMRectReadOnly) => footerHeight = rect.height"
			v-bind="{ fail: validationMessage.length > 0, focus: (isHover || isFocus) && !readonly, message: message || validationMessage }" />
		<ul v-show="isShowList" ref="listEl" class="textareaDatalist-list">
			<li v-for="(option, index) in filteredOptions" :key="option" class="textareaDatalist-list-item"
				:class="{ _active: active === index }" @click.stop="selectOption(option, $event)"
				@touchend.passive="selectOption(option, $event)">
				{{ option }}
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
/**
 * @name TextareaDatalist
 * @description テキストエリアにデータリストを表示する
 */
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { useRegex } from '../../composables/regex'
import { useUtils } from '../../composables/utils'
import { useId } from '#imports'

// Composables -------------------------------------------
const regex = useRegex()

// Emits ---------------------
const emit = defineEmits(['update:modelValue', 'valid', 'invalid', 'focus', 'blur'])

// Props ---------------------
const props = defineProps({
	name: { type: String, default: '' },
	type: { type: String, default: 'text' },
	label: { type: String, default: '' }, // 通常時は Placeholder になり、focus 時は上に移動してラベルとなる
	placeholder: { type: String, default: '' },
	description: { type: String, default: '' },
	message: { type: String, default: '' }, // エラー・バリデーションメッセージ
	modelValue: { type: String, default: '' },
	autocomplete: { type: Boolean, default: false }, // 自動補完
	rows: { type: Number, default: 1 }, // <textarea> の行数

	pattern: { type: String }, // 入力制限があれば。defaultは設定しなければ設定すらされないので、設定していない。
	maxlength: { type: [Number, String] },
	required: { type: Boolean, default: false },
	readonly: { type: Boolean, default: false },
	focus: { type: Boolean, default: false }, // フォーカスをあてる

	// バリデーションのタイミング設定
	validation: {
		type: String,
		default: 'blur', // デフォルトは blur 時。
		validator: (value: string) => ['always', 'blur'].includes(value), // 'always'または'blur'のみ許可します
	},

	perView: { type: [Number, String], default: 3.5 }, // 一度に表示するアイテム数
	list: { type: Array as () => string[], default: () => [] },
})

// Data ----------------------
const state = ref('idle') // idle, valid, invalid
const filteredOptions = ref<string[]>([])
const expand = ref(false)
const active = ref<number | null>(null)
const getId: string = `textareaDatalist-${props.name || useId()}`
const isFocus = ref(false) // フォーカスがあたっているかどうか
const isHover = ref(false)
const validationMessage = ref('')
const listEl = ref<HTMLElement | null>(null)
const footerHeight = ref(0)

// Computed -------------------------------------------
const classes = computed(() => {
	return {
		[`_${state.value}`]: true,
		_focus: isFocus.value,
		_input: text.value.length, // 入力があれば
	}
})
const styles = computed(() => {
	return {
		// なぜか InputDatalist と同じ値にすると、表示が 1/2 になるので、2倍にする。
		'--per-view': Number(props.perView) * 2,
	}
})
const isShowList = computed(() => {
	return expand.value && filteredOptions.value.length > 0 && text.value.length === 0
})
// 入力文字
const text = computed({
	get: () => props.modelValue,
	set: (value) => {
		// 値に変更があると呼ばれるsetter
		emit('update:modelValue', value)
	},
})

// Watch -------------------------------------------
watch(
	() => props.list,
	(newVal) => {
		filteredOptions.value = newVal
	},
)
watch(text, (value) => {
	if (props.validation === 'always') {
		validate()
	}
	emit('update:modelValue', value)
})

// Methods -------------------------------------------
const selectOption = async (option: string, event: Event) => {
	event.stopPropagation() // イベントの伝播を止める
	await useUtils().wait(200)
	emit('update:modelValue', option)
	text.value = option
	hideOptions()
}
const hideOptions = () => {
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
const handleKeydown = (event: KeyboardEvent) => {
	// リストが展開されているかどうかをチェック
	if (isShowList.value) {
		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault() // ブラウザのデフォルトの挙動をキャンセル
				handleUp()
				break
			case 'ArrowDown':
				event.preventDefault() // ブラウザのデフォルトの挙動をキャンセル
				handleDown()
				break
			case 'Enter':
				event.preventDefault() // ブラウザのデフォルトの挙動をキャンセル
				handleHit()
				break
		}
	}
	// リストが展開されていない場合は、Enter キーでの改行を許可する
}
const handleUp = () => {
	if (active.value === null) {
		active.value = 0
	}
	else if (active.value > 0) {
		active.value--
	}
	nextTick(scrollIntoView)
}
const handleDown = () => {
	if (active.value === null) {
		active.value = 0
	}
	else if (active.value < filteredOptions.value.length - 1) {
		active.value++
	}
	nextTick(scrollIntoView)
}
const handleHit = () => {
	if (active.value !== null) {
		selectOption(filteredOptions.value[active.value], new Event('click'))
	}
}
const handleFocus = () => {
	isFocus.value = true
	expand.value = true
	emit('focus')
}
const handleBlur = async () => {
	// Textarea の blur 処理前にリストのクリックイベントが発火させるために、少し待つ。
	await useUtils().wait(200)

	if (props.validation === 'blur') {
		validate()
	}
	isFocus.value = false
	hideOptions()
	emit('blur')
}
const validate = () => {
	let message = ''
	if (text.value === '' && props.required) {
		message = '入力してください。'
	}
	if (!message && props.maxlength) {
		if (text.value.length > Number.parseInt(String(props.maxlength))) {
			message = `${props.maxlength}文字以内で入力してください。現在${text.value.length}文字です。`
		}
	}
	if (!message && props.required && text.value !== '' && text.value.match(regex.noOnlySpace)) {
		message = '空白のみの入力はできません。'
	}

	if (!message) {
		state.value = 'valid'
		emit('valid')
	}
	else {
		state.value = 'invalid'
		emit('invalid')
		validationMessage.value = message
	}
}

// Lifecycle Hooks -------------------------------------------
onMounted(() => {
	filteredOptions.value = props.list
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
$cn: '.textareaDatalist'; // コンポーネントクラス名

$datalist-padding-top: 8;
$datalist-padding-bottom: 8;

$item-padding-top: 4px;
$item-padding-right: 12px;
$item-padding-left: 12px;
$item-padding-bottom: 4px;
$item-font-size: 0.6em;
$item-font-size-min: 12px;

$perview: var(--per-view);

#{$cn} {
	position: relative;
	width: 100%;
	outline: none;

	&-footer {
		padding-top: 4px;

		&-desc {
			flex-shrink: 1;
		}

		&-length {
			margin-left: auto;
			padding-left: 8px;
		}
	}

	&-list {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 1;
		width: 100%;
		max-height: calc(#{$perview} * 1em + #{$perview} * #{$item-padding-top} + #{$perview} * #{ $item-padding-bottom});
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
			font-weight: bold;
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
}
</style>

<template>
	<div class="inputTag" :class="classes" @mouseover="isHover = true" @mouseleave="isHover = false">
		<Typography v-if="label" tag="label" :for="getId" class="inputTag-label">
			<span class="inputTag-label-inner">{{ label
			}}</span><span v-if="required" class="inputTag-label-required">*</span>
		</Typography>
		<VueDraggable v-model="model" class="inputTag-items" :disabled="isDragDisabled" :animation="150"
			:style="{ display: 'flex', flexWrap: 'wrap', gap: `${gap}px`, justifyContent: 'start', alignItems: 'stretch' }"
			:draggable="'._draggable'" @start="handleMove(true);" @end="handleMove(false)">
			<Box v-for="tag in model" :key="tag.id" class="inputTag-items-item _draggable" pt="3.2" pb="4.8" pl="8" pr="4"
				r="2" color="text" relative inline-block @mouseover="handleDrag" @mouseleave="handleDrag(false)">
				<Row gap="4" align="center">
					<Typography inherit lineclamp="1" color="background" cap-height-baseline>
						{{ tag.value }}
					</Typography>
					<Button minimal xsmall w="20" h="20" @click="remove(tag.id)">
						<Box pt="2" mr="-4">
							<Icon name="cross" size="10" color="background" />
						</Box>
					</Button>
				</Row>
			</Box>
			<Row align="center" style="width: auto" :class="isMoving ? '' : '_draggable'">
				<Textarea v-if="isInput" :id="getId" v-model="text" :style="inputStyle" :placeholder="freeInputPlaceholder"
					type="text" rows="1" :autoheight="false" :focus="isDragging ? false : focus" v-bind="{ name }"
					@input="handleInput" @focus="handleFocus" @blur="handleBlur" />
			</Row>
		</VueDraggable>
	</div>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { computed, ref, nextTick } from 'vue'
import Typography from '../elements/Typography.vue'
import Button from '../elements/Button.vue'
import Icon from '../elements/Icon.vue'
import Box from '../layout/Box.vue'
import Row from '../layout/Row.vue'
import Textarea from '../forms/Textarea.vue'

// Composables ----------------------

// Models ----------------------
const model = defineModel<{ id: number, value: string }[]>({ default: () => [] })

// Props ----------------------
const props = defineProps({
	name: { type: String, default: 'tag', required: true },
	label: { type: String, default: '' }, // ラベル
	placeholder: { type: String, default: 'フリーテキストで追加' }, // 入力欄のプレースホルダー
	max: { type: [Number, String], default: 0 }, // 最大タグ数。0は無制限
	description: { type: String, default: '' },
	readonly: { type: Boolean, default: false }, // 入力欄を読み取り専用にするかどうか
	required: { type: Boolean, default: false }, // 必須かどうか
	gap: { type: [Number, String], default: 8 }, // タグ間のギャップ
	focus: { type: Boolean, default: false }, // フォーカスを当てるかどうか
})

// Emits -------------------------------------------
const emit = defineEmits({
	'update:modelValue': (_list: Array<string>) => true,
	'enter-key-down': () => true,
	'valid': () => true,
	'invalid': (_message: string) => true,
	'focus': () => true,
	'blur': () => true,
})

// Data -------------------
const state = ref('idle') // idle, valid, invalid
const text = ref<string>('')
const isFocus = ref(false) // フォーカスがあたっているかどうか
const isHover = ref(false)
const isDragging = ref(false)
const isMoving = ref(false) // ドラッグして動かしているかどうか
const isDragDisabled = ref(false)
const getId: string = `inputTag-${props.name}`
const validationMessage = ref('')

// Computed -------------------
const classes = computed(() => {
	return {
		[`_${state.value}`]: true,
		_focus: isFocus.value,
		_has: model.value.length > 0,
	}
})
const isInput = computed(() => {
	let flag = true
	if (props.max) {
		flag = model.value.length < Number.parseInt(String(props.max))
	}
	return flag
})
const inputStyle = computed(() => {
	const placeholderLength = props.placeholder.length
	const textLength = text.value?.length
	const minWidth = `${Math.max(placeholderLength, textLength)}em`
	return { minWidth }
})
const freeInputPlaceholder = computed(() => {
	if (!isInput.value) return ''

	let str = props.placeholder
	if (props.label) {
		if (!isFocus.value) {
			if (!model.value.length) {
				str = ''
			}
		}
	}
	return str
})

// Methods ----------------
const handleDrag = (flag: boolean = true) => {
	/**
	 * ドラッグ中にフォーカスを外すために必要。
	 * Input にフォーカスが当たっていると vue-draggable-plus が動作しないため。
	 */
	isDragging.value = flag
}
const add = () => {
	if (text.value && !model.value.some(tag => tag.value === text.value)) {
		model.value.push({ id: Date.now(), value: text.value })
		text.value = ''
	}
	validate()
}
const remove = (id: number) => {
	model.value.splice(model.value.findIndex(tag => tag.id === id), 1)
	validate()
}
const handleInput = async () => {
	if (text.value.includes('\n')) {
		isDragDisabled.value = true
		await nextTick()
		text.value = text.value.replace(/\n/g, '') // 改行を削除
		add()
		await nextTick()
		isDragDisabled.value = false
	}
}
const handleFocus = () => {
	isFocus.value = true
	emit('focus')
}
const handleBlur = () => {
	isFocus.value = false
	emit('blur')
	if (text.value && !isDragging.value) {
		add()
	}
	validate()
}
const handleMove = (flag: boolean) => {
	isMoving.value = flag
}
const validate = () => {
	let message = ''
	if (!model.value.length && props.required) {
		message = '入力してください。'
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
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.inputTag'; // コンポーネントセレクタ名

$padding-top: 8;
$padding-bottom: 10;

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		width: 100%;

		&-items {
			padding-top: func.get-size($padding-top);
			padding-bottom: func.get-size($padding-bottom);

			&-item {
				cursor: grab;
			}

			&-item+.row {
				margin-left: func.get-size(4);
			}
		}

		& &-label {
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

			display: block;
			position: absolute;
			top: 0;
			left: 0;
			transform: translate(0em, func.get-size($padding-top));
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

		&-footer {
			padding-top: func.get-size(4);

			&-desc {
				flex-shrink: 1;
			}

			&-length {
				margin-left: auto;
				padding-left: func.get-size(8);
			}
		}

		&._focus {
			#{$cn}-label {
				font-size: func.get-size(10);
				transform: translate(0em, -1.2em);

				&-inner {
					opacity: 1;
				}
			}
		}

		&._has {

			#{$cn}-label {
				font-size: func.get-size(10);
				transform: translate(0em, -1.2em);

				&-inner {
					opacity: 1;
				}
			}
		}

		&._invalid {
			#{$cn}-label {
				color: var(--color-danger);
			}
		}
	}

	@if $mode =='darkmode' {

		&-label {
			color: var(--color-light);
		}
	}

	@if $mode =='auto' {
		&-items {
			padding-top: func.get-size($padding-top, false);
			padding-bottom: func.get-size($padding-bottom, false);

			&-item+.row {
				margin-left: func.get-size(4, false);
			}
		}

		&-label {
			transform: translate(0em, func.get-size($padding-top, false));
		}

		&-footer {
			padding-top: func.get-size(4, false);

			&-length {
				padding-left: func.get-size(8, false);
			}
		}

		&._focus &-label {
			font-size: func.get-size(10, false);

		}

		&._has &-label {
			font-size: func.get-size(10, false);
		}
	}
}
</style>

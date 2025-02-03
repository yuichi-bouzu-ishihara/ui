<template>
	<Button class="iconButton" v-bind="$attrs" rounded @click="emit(EMIT_CLICK)"
		@disabled-click="emit(EMIT_DISABLED_CLICK)" @loading-click="emit(EMIT_LOADING_CLICK)">
		<Icon class="iconButton-icon" v-bind="{ name, size, color, gradation }" />
	</Button>
</template>

<script setup lang="ts">
import Button from './Button.vue'
import Icon from './Icon.vue'
import { computed, useAttrs } from '#imports'

// Props ---------------------------
const props = defineProps({
	icon: {
		type: Object,
		default: () => ({
			name: '',
			size: 0,
		}),
	}, // アイコンの設定をまとめて受け取る
})

// Emits ---------------------------
const EMIT_CLICK = 'click'
const EMIT_DISABLED_CLICK = 'disabled-click'
const EMIT_LOADING_CLICK = 'loading-click'
const emit = defineEmits([EMIT_CLICK, EMIT_DISABLED_CLICK, EMIT_LOADING_CLICK])

// Computed ---------------------------
const name = computed(() => props.icon.name)
const size = computed(() => {
	let num = props.icon.size
	if (num === 0 || num === undefined) {
		switch (buttonSize.value) {
			case 'large':
				num = 24
				break
			case 'small':
				num = 16
				break
			case 'xsmall':
				num = 12
				break
			case 'medium':
			default:
				num = 20
				break
		}
	}
	return num
})
const priority = computed(() => {
	const attrs = useAttrs()
	if ('primary' in attrs) {
		return 'primary'
	}
	else if ('secondary' in attrs) {
		return 'secondary'
	}
	else if ('tertiary' in attrs) {
		return 'tertiary'
	}
	else if ('quaternary' in attrs) {
		return 'quaternary'
	}
	else if ('info' in attrs) {
		return 'info'
	}
	else if ('link' in attrs) {
		return 'link'
	}
	else if ('minimal' in attrs) {
		return 'minimal'
	}
	else {
		return 'primary'
	}
})
const buttonSize = computed(() => {
	const attrs = useAttrs()
	if ('large' in attrs) {
		return 'large'
	}
	else if ('medium' in attrs) {
		return 'medium'
	}
	else if ('small' in attrs) {
		return 'small'
	}
	else if ('xsmall' in attrs) {
		return 'xsmall'
	}
	else {
		return 'medium'
	}
})
const color = computed(() => {
	let str = ''
	switch (priority.value) {
		case 'primary':
			str = 'light'
			break
		case 'secondary':
			str = 'background'
			break
		case 'tertiary':
		case 'quaternary':
		case 'link':
			str = 'text'
			break
		case 'info':
			str = ''
			break
		case 'minimal':
			str = 'text060'
			break
	}
	return str
})
const gradation = computed(() => {
	let str = ''
	switch (priority.value) {
		case 'info':
			str = 'horizontal'
			break
	}
	return str
})
</script>

<style lang="scss">
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.iconButton'; // コンポーネントセレクタ名

$large-size: 48;
$medium-size: 44;
$small-size: 36;
$xsmall-size: 32;

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;

		&._xsmall {
			width: func.get-size($xsmall-size);
			height: func.get-size($xsmall-size);
		}

		&._small {
			width: func.get-size($small-size);
			height: func.get-size($small-size);
		}

		&._medium {
			width: func.get-size($medium-size);
			height: func.get-size($medium-size);
		}

		&._large {
			width: func.get-size($large-size);
			height: func.get-size($large-size);
		}

		.button-inner-slot {
			padding: 0;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}

// OS毎にテキストが上にズレる現象の対策
// MacOSを基準にして、他のOSのズレを調整する。
#__nuxt._windows,
#__nuxt._linux,
#__nuxt._android {
	#{$cn}-inner-icon {
		transform: translateY(-0.12em) !important;
	}
}
</style>

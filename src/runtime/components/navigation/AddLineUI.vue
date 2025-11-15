<template>
	<div class="addLineUI" :class="{ _hover: isHover, _focus: isFocus }" :style="styles">
		<Row class="addLineUI-inner" justify="center" align="center" gap="12" nowrap fit-w>
			<div class="addLineUI-inner-bar _left" :style="{ height: `${stroke}px` }" />
			<div class="addLineUI-inner-icon">
				<Icon name="plus" size="10" :color="color ? color.background : 'background'" />
			</div>
			<div class="addLineUI-inner-bar _right" :style="{ height: `${stroke}px` }" />
		</Row>
		<div class="addLineUI-hover" @click="emit('click')" @mouseover="isHover = true" @mouseleave="isHover = false" />
	</div>
</template>

<script setup lang="ts">
// Props ------------------------------------------------------------
const props = defineProps({
	stroke: { type: [Number, String], default: 2 }, // 線の太さ px
	focus: { type: Boolean, default: false }, // フォーカスされているかどうか
	color: { type: Object as () => CustomColor, default: null },
})

// Emits ------------------------------------------------------------
const emit = defineEmits<{
	click: []
}>()

// Data ------------------------------------------------------------
const isHover = ref(false)

// Computed ------------------------------------------------------------
const isFocus = computed(() => props.focus)
const styles = computed(() => {
	return {
		'--custom-color-background': props.color ? props.color.background : 'background',
		'--custom-color-text': props.color ? props.color.text : 'text',
	}
})
</script>

<style lang="scss">
$cn: '.addLineUI';

$size: 28px;

#{$cn} {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	cursor: pointer;

	&-hover {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 100%;
		height: $size;
		// background-color: var(--color-primary-050);
	}

	&-inner {
		position: relative;

		&-bar {
			flex: 1;
			// background-color: var(--color-text-020);

			&::before {
				content: '';
				display: block;
				width: 100%;
				height: 100%;
				background-color: var(--custom-color-text);
				transition: transform 0.15s ease-in-out;
				transform: scaleX(0);
			}

			&._left::before {
				transform-origin: right;
			}

			&._right::before {
				transform-origin: left;
			}
		}

		&-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: $size;
			height: $size;
			border-radius: 4px;
			background-color: var(--custom-color-text);
			transition: all 0.15s ease-in-out;
			opacity: 0.2;
		}
	}

	&._hover,
	&._focus {
		.addLineUI-inner-icon {
			opacity: 1;
		}

		.addLineUI-inner-bar::before {
			transform: scaleX(1);
		}

		.addLineUI-inner-icon {
			transform: scale(1);
		}
	}

	&:active {
		.addLineUI-inner-icon {
			transform: scale(0.9);
		}
	}
}
</style>

<template>
	<Row class="colorModeSwitch" :class="classes" gap="10" align="start" nowrap>
		<input :id="ID" v-model="checked" type="checkbox" class="colorModeSwitch-input" :name="NAME">
		<label :for="ID" class="colorModeSwitch-inner">
			<div class="colorModeSwitch-inner-handle">
				<Icon :name="iconName" size="12" :color="iconColor" />
			</div>
		</label>
	</Row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Row from '../layout/Row.vue'
import Icon from '../elements/Icon.vue'

// Constants ------------------
const ID = 'colorModeSwitch'
const NAME = 'colorModeSwitch'

// Models ------------------
const mode = defineModel<string>({ default: 'light' })

// Computed ------------------
const classes = computed(() => {
	return {
		_checked: checked.value,
	}
})
const checked = computed({
	get: () => mode.value === 'dark',
	set: (value) => {
		// 値に変更があると呼ばれるsetter
		mode.value = value ? 'dark' : 'light'
	},
})
const iconName = computed(() => {
	return mode.value === 'light' ? 'sun' : 'moon'
})
const iconColor = computed(() => {
	return mode.value === 'light' ? 'dark' : 'light'
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.colorModeSwitch'; // コンポーネントセレクタ名

#{$cn} {
	// サイズ
	$width: 40px;
	$height: 24px;
	$handle-size: 20px;
	$padding: 2px;

	// スイッチの背景色
	$color: var(--color-text); // スイッチOFF時の背景色
	$color-checked: var(--color-text); // スイッチON時の背景色

	width: auto;
	@include mix.tap-highlight-transparent();

	&-input {
		/* チェックボックスは使わないので非表示 */
		display: none;

		&:checked+#{$cn}-inner {
			background-color: $color-checked;

			#{$cn}-inner-handle {
				/* スイッチONの時の左側余白 */
				left: calc($width - $handle-size - $padding);
			}
		}
	}

	&-inner {
		position: relative;
		background-color: $color;
		border-radius: var.$border-radius-full;
		/* 角丸 */
		cursor: pointer;
		display: flex;
		align-items: center;
		font-size: 12px;
		width: $width;
		min-width: $width;
		height: $height;
		min-height: $height;
		transition: 0.2s;

		&-handle {
			position: absolute;
			background-color: var(--color-background);
			border-radius: 100%;
			content: '';
			width: $handle-size;
			min-width: $handle-size;
			height: $handle-size;
			min-height: $handle-size;
			left: $padding;
			transition: 0.2s ease-out;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	&._disabled>&-inner {
		opacity: 0.6;
		cursor: default;
		pointer-events: none;
	}

	&._readonly>&-inner {
		cursor: default;
		pointer-events: none;
	}
}
</style>

<template>
	<div class="clickable" :class="{ _disabled: disabled }" @click="emit('click')">
		<slot />
	</div>
</template>

<script setup lang="ts">
// Props ------------------
defineProps({
	disabled: { type: Boolean, default: false },
})

// Emits ------------------
const emit = defineEmits(['click'])
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.clickable'; // コンポーネントセレクタ名

#{$cn} {
	&:not(._disabled) {
		cursor: pointer;
		transition: var.$transition-base;
		pointer-events: auto;

		&:hover {
			opacity: 0.9;
		}

		&:active {
			transform: scale(0.98);
			opacity: 0.8;
		}
	}

	&._disabled {
		pointer-events: none;
	}
}
</style>

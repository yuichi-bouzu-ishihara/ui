<template>
	<component :is="to ? BasicLink : 'div'" class="iconMenu" :to="isCurrent ? '' : to" no-hover-style
		@mouseover="hover = true" @mouseleave="hover = false">
		<Icon :style="{ transform: `scale(${scale})`, opacity: isCurrent || hover ? 0.6 : 1 }" :name="icon"
			:color="color ? color : 'dark'" v-bind="{ size }" />
		<template v-if="notice">
			<Box class="iconMenu-notice" r="circle" color="primary" w="4" h="4" absolute :bottom="baseAbove() ? 'auto' : -8"
				:top="baseAbove() ? -12 : 'auto'" left="0" right="0" ml="auto" mr="auto" />
		</template>
	</component>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import BasicLink from '../elements/BasicLink.vue'
import Icon from '../elements/Icon.vue'
import Box from '../layout/Box.vue'
import { useBreakPoint } from '../../composables/break-point'

// Stores --------------------------------------------------
const { baseAbove } = useBreakPoint()

// Props --------------------------------------------------
const props = defineProps({
	to: { type: String, default: '' },
	icon: { type: String, default: '' },
	size: { type: [Number, String], default: 20 },
	scale: { type: [Number, String], default: 1 }, // アイコンサイズの調整
	color: { type: String, default: '' },
	notice: { type: Boolean, default: false },
})

// Data --------------------------------------------------------
const hover: Ref<boolean> = ref(false)

// Computed --------------------------------------------------------
const isCurrent = computed(() => {
	let flag = false
	if (props.to) {
		flag = useRoute().path.includes(props.to)
	}
	return flag
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.iconMenu'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		transition: var.$transition-base;
		cursor: pointer;
		pointer-events: auto;
		-webkit-tap-highlight-color: transparent; // タップ時のハイライトを消す

		// マウスでクリックされている間のスタイル
		&:active:not(._disabled) {
			transform: scale(0.9);
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

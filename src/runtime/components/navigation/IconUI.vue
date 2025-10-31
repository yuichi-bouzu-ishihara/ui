<template>
	<Box class="iconUI" v-bind="box" relative @mouseover="hover = true" @mouseleave="hover = false">
		<component :is="to ? BasicLink : 'div'" class="iconUI-inner" :to="isCurrent ? '' : to" no-hover-style>
			<Icon class="iconUI-inner-icon"
				:style="{ transform: `scale(${mergeIcon.scale})`, opacity: isCurrent || hover ? 1 : 0.6 }"
				:name="mergeIcon.name" v-bind="{ color: mergeIcon.color, size: mergeIcon.size }" />
			<template v-if="notice">
				<Box r="circle" color="primary" w="4" h="4" absolute :bottom="baseAbove() ? 'auto' : -8"
					:top="baseAbove() ? -12 : 'auto'" left="0" right="0" ml="auto" mr="auto" />
			</template>
		</component>
	</Box>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakPoint } from '../../composables/break-point'
import BasicLink from '../elements/BasicLink.vue'
import Box from '../layout/Box.vue'
import Icon from '../elements/Icon.vue'

// Types --------------------------------------------------
type Icon = {
	name: string
	size?: number
	color?: string
	scale?: number
}
type BoxStyle = {
	w: number
	h: number
}

// Composables --------------------------------------------------
const { baseAbove } = useBreakPoint()
const route = useRoute()

// Props --------------------------------------------------
const props = defineProps({
	to: { type: String, default: '' },
	icon: { type: Object as () => Icon | null, default: () => null },
	enabled: { type: Boolean, default: true },
	notice: { type: Boolean, default: false },
	box: { type: Object as () => BoxStyle | null, default: () => null },
})

// Data --------------------------------------------------------
const hover: Ref<boolean> = ref(false)

// Computed --------------------------------------------------------
const mergeIcon = computed(() => {
	return {
		name: props.icon?.name || '',
		size: props.icon?.size || 20,
		color: props.icon?.color || 'text',
		scale: props.icon?.scale || 1,
	}
})
const isCurrent = computed(() => {
	let flag = false
	if (props.to) {
		flag = route.path.includes(props.to)
	}
	return flag
})
</script>

<style lang="scss">
@use '../../../../src/runtime/scss/_variables.scss' as var;
$cn: '.iconUI'; // コンポーネントクラス名

#{$cn} {
	&-inner {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		pointer-events: auto;
		cursor: pointer;
		transition: var.$transition-base;
		-webkit-tap-highlight-color: transparent; // タップ時のハイライトを消す

		// マウスでクリックされている間のスタイル
		&:active:not(._disabled) {
			transform: scale(0.9);
		}

		&-icon {
			transition: var.$transition-base;
		}
	}
}
</style>

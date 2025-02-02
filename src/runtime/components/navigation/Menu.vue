<template>
	<component :is="to ? BasicLink : 'div'" class="menu" :class="classes" v-bind="{ to }" no-hover-style>
		<Box w="100%" h="48" @mouseover="hover = true" @mouseleave="hover = false">
			<Row gap="12" align="center" nowrap fit>
				<Box w="20" h="20">
					<Column justify="center" align="center" fit>
						<template v-if="face">
							<Avatar :src="face" v-bind="{ size }" />
						</template>
						<template v-else>
							<Icon :name="icon" v-bind="{ size, color }" />
						</template>
					</Column>
				</Box>
				<Typography body bold baseline-height transition unselectable lineclamp="1" v-bind="{ color }">
					{{ name }}
				</Typography>
			</Row>
		</Box>
	</component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import BasicLink from '../elements/BasicLink.vue'
import Avatar from '../elements/Avatar.vue'
import Icon from '../elements/Icon.vue'
import Typography from '../elements/Typography.vue'
import Row from '../layout/Row.vue'
import Box from '../layout/Box.vue'
import Column from '../layout/Column.vue'
import { useCss } from '../../composables/css'
import { useNumber } from '../../composables/number'

// Composables -----------------------------------------------------
const { getSize } = useCss()
const { isPureNumber } = useNumber()

// Props --------------------------------------------------------
const props = defineProps({
	to: { type: String, default: '' },
	icon: { type: String, default: '' },
	face: { type: String, default: '' }, // アバター画像
	iconSize: { type: [String, Number], default: 20 },
	name: { type: String, required: true },
	disabled: { type: Boolean, default: false },
})

// Computed -----------------------------------------------------
const classes = computed(() => {
	return {
		_current: current.value,
		_disabled: props.disabled,
	}
})
const color = computed(() => (current.value || hover.value ? 'text' : 'text060'))

// Data -----------------------------------------------------
const hover = ref(false)

// Computed -----------------------------------------------------
const current = computed(() => {
	return props.to && useRoute().path.startsWith(props.to)
})
const size = computed(() => {
	if (isPureNumber(props.iconSize)) {
		if (Number(props.iconSize) > 0) {
			return getSize(Number(props.iconSize))
		}
	}
	return props.iconSize || 20
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
$cn: '.menu'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		width: 100%;
		cursor: pointer;
		transition: var.$transition-base;

		&:not(._disabled) {
			&:active {
				opacity: .8;
				transform: scale(0.95);
			}
		}

		&._disabled {
			pointer-events: none;
			cursor: default;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

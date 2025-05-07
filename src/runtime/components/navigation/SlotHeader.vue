<template>
	<Box class="slotHeader" :color="background" :bg-blur="blur">
		<Row class="slotHeader-inner" justify="center" align="center" :gap="GAP" nowrap fit>
			<div class="slotHeader-inner-left">
				<Box :h="UI_SIZE">
					<Center>
						<slot name="left" />
					</Center>
				</Box>
			</div>
			<Box class="slotHeader-inner-center" :max-w="maxWidth" h="100%">
				<Center>
					<template v-if="title">
						<Typography body bold center>
							{{ title }}
						</Typography>
					</template>
					<template v-else>
						<slot name="center" />
					</template>
				</Center>
			</Box>
			<div class="slotHeader-inner-right">
				<Row justify="end" align="center" nowrap fit>
					<Box :h="UI_SIZE">
						<Center>
							<slot name="right" />
						</Center>
					</Box>
				</Row>
			</div>
		</Row>
	</Box>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Typography from '../elements/Typography.vue'
import Row from '../layout/Row.vue'
import Box from '../layout/Box.vue'
import Center from '../layout/Center.vue'
import { useCss } from '../../composables/css'

// Constants --------------------------------------------------
const GAP = 8
const UI_SIZE = 64

// Props --------------------------------------------------
defineProps({
	title: { type: String, default: '' },
	background: { type: String, default: 'background-090' },
	blur: { type: Boolean, default: false },
})

// Computed --------------------------------------------------------
const maxWidth = computed(() => {
	return `calc(100% - ${useCss().getSize((UI_SIZE + GAP) * 2)})`
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.slotHeader'; // コンポーネントセレクタ名

$transition-base: var.$transition-base;

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		min-height: func.get-size(var.$header-height);
		height: func.get-size(var.$header-height);
		transition: var.$transition-base;

		&-inner {
			position: relative;

			&-left {
				position: absolute;
				left: var(--container-min-side-space);
			}

			&-right {
				position: absolute;
				right: var(--container-min-side-space);
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

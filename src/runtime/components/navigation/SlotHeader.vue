<template>
	<Box class="slotHeader" relative>
		<Box v-if="blur" class="slotHeader-blur" :bg-blur="blur" absolute top="0" left="0" w="100%" h="100%" />
		<Box class="slotHeader-bg" :color="background" :bg-blur="blur" absolute top="0" left="0" w="100%" h="100%" />
		<Row class="slotHeader-inner" justify="center" align="center" :gap="GAP" nowrap fit>
			<div class="slotHeader-inner-left">
				<Box :h="UI_SIZE">
					<Center>
						<slot name="left" />
					</Center>
				</Box>
			</div>
			<Box class="slotHeader-inner-center" :max-w="maxWidth" h="100%">
				<Column justify="center" align="center" gap="12" fit-h>
					<template v-if="title">
						<Typography body bold center cap-height-baseline :color="color">
							{{ title }}
						</Typography>
					</template>
					<template v-else>
						<slot name="center" />
					</template>
					<template v-if="pagenation">
						<Pagenation :current="pagenation.current" :total="pagenation.total" />
					</template>
				</Column>
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
import { computed, type PropType } from 'vue'
import Typography from '../elements/Typography.vue'
import Row from '../layout/Row.vue'
import Box from '../layout/Box.vue'
import Center from '../layout/Center.vue'
import Column from '../layout/Column.vue'
import Pagenation, { type Props as PagenationProps } from './Pagenation.vue'
import { useCss } from '../../composables/css'

// Constants --------------------------------------------------
const GAP = 8
const UI_SIZE = 64

// Props --------------------------------------------------
defineProps({
	title: { type: String, default: '' },
	pagenation: { type: Object as PropType<PagenationProps | null>, default: null },
	background: { type: String, default: 'background' },
	color: { type: String, default: 'text' },
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

#{$cn} {
	min-height: var(--header-height);
	height: var(--header-height);
	transition: var.$transition-base;

	&-blur {
		border-radius: inherit;
	}

	&-bg {
		border-radius: inherit;
		opacity: 0.9;
	}

	&-inner {
		position: relative;

		&-left {
			position: absolute;
			left: 0;
		}

		&-right {
			position: absolute;
			right: 0;
		}
	}
}
</style>

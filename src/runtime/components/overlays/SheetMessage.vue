<template>
	<Sheet class="sheetMessage" close v-bind="{ ...$attrs, title, full, wide, narrow }"
		@close="close($attrs.index as number, false)">
		<SheetContainer>
			<Column justify="center" align="end" gap="20">
				<template v-if="icon">
					<Icon class="sheetMessage-icon" :name="icon" size="56" :color="color.text" />
				</template>
				<template v-if="content">
					<Typography font-size="18" bold center :color="color.text">
						<!-- eslint-disable-next-line vue/no-v-html -->
						<span v-html="content" />
					</Typography>
				</template>
				<template v-if="buttonName">
					<Box w="100%" mt="12" mb="-8">
						<Button w="100%" @click="close($attrs.index as number, true)">
							{{ buttonName }}
						</Button>
					</Box>
				</template>
			</Column>
		</SheetContainer>
	</Sheet>
</template>

<script setup lang="ts">
import { useSheet } from '../../composables/overlays/sheet'
import Box from '../layout/Box.vue'
import Column from '../layout/Column.vue'
import Button from '../elements/Button.vue'
import Typography from '../elements/Typography.vue'
import Icon from '../elements/Icon.vue'
import Sheet from './Sheet.vue'
import SheetContainer from './SheetContainer.vue'

// Types ---------------------------
export type Props = {
	title?: string
	icon?: string
	content?: string
	buttonName?: string
	full?: boolean
	wide?: boolean
	narrow?: boolean
}
// Composables ---------------------------
const { close, color } = useSheet()

// Props -----------------------------------------------
withDefaults(defineProps<Props>(), {
	title: '',
	icon: '',
	content: '',
	buttonName: '',
	full: false,
	wide: false,
	narrow: false,
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.sheetMessage'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		// &-icon {
		// 	margin-top: func.get-size(-4);
		// }
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

<template>
	<Sheet class="sheetMessage" close v-bind="{ title, narrow }" @close="close(false)">
		<SheetContainer>
			<Column justify="center" align="end" gap="20">
				<template v-if="icon">
					<Icon class="sheetMessage-icon" :name="icon" size="56" color="text" />
				</template>
				<template v-if="content">
					<Typography font-size="18" bold center>
						<!-- eslint-disable-next-line vue/no-v-html -->
						<span v-html="content" />
					</Typography>
				</template>
				<template v-if="buttonName">
					<Box w="100%" mt="12" mb="-8">
						<Button w="100%" @click="close(true)">
							{{ buttonName }}
						</Button>
					</Box>
				</template>
			</Column>
		</SheetContainer>
	</Sheet>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSheet } from '../../composables/overlays/sheet'
import Box from '../layout/Box.vue'
import Column from '../layout/Column.vue'
import Button from '../elements/Button.vue'
import Typography from '../elements/Typography.vue'
import Icon from '../elements/Icon.vue'
import Sheet from './Sheet.vue'
import SheetContainer from './SheetContainer.vue'

// Stores & Composables ---------------------------
const { options, close } = useSheet()

// Computed -----------------------------------------------
const title = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('title' in options.value) {
			return options.value.title as string
		}
	}
	return ''
})
const icon = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('icon' in options.value) {
			return options.value.icon as string
		}
	}
	return ''
})
const content = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('content' in options.value) {
			return options.value.content as string
		}
	}
	return ''
})
const buttonName = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('buttonName' in options.value) {
			return options.value.buttonName as string
		}
	}
	return ''
})
const narrow = computed(() => {
	if (options.value && typeof options.value === 'object') {
		if ('narrow' in options.value) {
			return options.value.narrow as boolean
		}
	}
	return true
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

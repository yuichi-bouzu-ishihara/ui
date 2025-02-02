<template>
	<DialogContainer class="dialogConfirm">
		<Column gap="24" justify="stretch">
			<Row justify="center">
				<Icon :name="icon" size="52" color="text" />
			</Row>
			<Column gap="8" justify="center">
				<Typography caption2 center bold linebreak>
					{{ title }}
				</Typography>
				<template v-if="message">
					<Typography caption3 center linebreak>
						<div v-html="message" />
					</Typography>
				</template>
			</Column>
			<template v-if="buttons">
				<Column justify="stretch" gap="8">
					<Button secondary xsmall @click="close(true)">
						{{
							buttons.ok }}
					</Button>
					<Button link xsmall @click="close(false)">
						{{
							buttons.cancel }}
					</Button>
				</Column>
			</template>
		</Column>
	</DialogContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDialog, type PayloadConfirm } from '../../composables/overlays/dialog'
import Typography from '../elements/Typography.vue'
import Icon from '../elements/Icon.vue'
import Button from '../elements/Button.vue'
import Column from '../layout/Column.vue'
import Row from '../layout/Row.vue'
import DialogContainer from './DialogContainer.vue'

// Composables ------------------
const { payload, close } = useDialog()

// Computed ------------------
const icon = computed(() => payload.value?.icon)
const title = computed(() => payload.value?.title)
const message = computed(() => payload.value?.message)
const buttons = computed(() => {
	if (payload.value && 'buttons' in payload.value) {
		return (payload.value as PayloadConfirm)?.buttons
	}
	return null
})
</script>

<style lang="scss"></style>

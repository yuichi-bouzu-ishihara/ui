<template>
	<DialogContainer class="dialogAlert">
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
						<!-- eslint-disable-next-line vue/no-v-html -->
						<div v-html="message" />
					</Typography>
				</template>
			</Column>
			<Column justify="stretch">
				<Button secondary xsmall @click="close">
					{{ button }}
				</Button>
			</Column>
		</Column>
	</DialogContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDialog, type PayloadAlert } from '../../composables/overlays/dialog'
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
const button = computed(() => (payload.value as PayloadAlert)?.button)
</script>

<style lang="scss"></style>

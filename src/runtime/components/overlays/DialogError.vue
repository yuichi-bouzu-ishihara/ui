<template>
	<DialogContainer class="dialogError-container">
		<Column gap="24" justify="stretch">
			<Row class="dialogError-container-icon" justify="center">
				<Icon :name="icon" size="52" color="danger" />
			</Row>
			<Column class="dialogError-container-txt" gap="8" justify="center">
				<Typography class="dialogError-container-txt-ttl" caption2 center bold linebreak>
					{{ title }}
				</Typography>
				<template v-if="message">
					<Typography class="dialogError-container-txt-desc" caption3 center linebreak>
						<div v-html="message" />
					</Typography>
				</template>
				<Typography v-if="code" footnote center color="dark40">
					{{
						code
					}}
				</Typography>
			</Column>
			<Column class="dialogError-container-btns" justify="stretch">
				<Button secondary xsmall @click="ok">
					{{ button }}
				</Button>
			</Column>
		</Column>
	</DialogContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDialog, type PayloadError } from '../../composables/overlays/dialog'
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
const code = computed(() => (payload.value as PayloadError)?.code)
const button = computed(() => (payload.value as PayloadError)?.button)
const redirect = computed(() => (payload.value as PayloadError)?.redirect)

// Methods /////////////////
const ok = () => {
	if (redirect.value) {
		if (redirect.value === 'back') {
			useRouter().back()
		}
		else {
			location.href = redirect.value
		}
	}
	close()
}
</script>

<style lang="scss"></style>

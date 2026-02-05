<template>
	<div class="testModal" @click="close(false)">
		<Center>
			<Typography title3 center color="light">
				{{ title }}
			</Typography>
			<Typography body center color="light" v-if="message">
				{{ message }}
			</Typography>
			<Button @click.stop="close('confirmed')" style="margin-top: 16px;">
				閉じる
			</Button>
		</Center>
	</div>
</template>

<script setup lang="ts">
// Props ---------------------------
const propsDefinition = defineProps<{
	title?: string
	message?: string
}>()

// Stores & Composables ---------------------------
const { close } = useModal()
</script>

<style lang="scss">
.testModal {
	background-color: rgba(40, 40, 60, 0.95);
	border-radius: 16px;
	padding: 32px 48px;
	min-width: 300px;
	max-width: 90vw;
}
</style>

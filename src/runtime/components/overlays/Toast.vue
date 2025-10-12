<template>
	<div class="toast" :class="classes">
		<Row gap="12" nowrap fit-w>
			<Icon v-if="icon" class="toast-icon" :name="icon" size="18" :color="type === 'error' ? 'danger' : 'text'" />
			<Typography caption2 bold cap-height-baseline lineclamp="1" :color="type === 'error' ? 'danger' : 'text'">
				{{ message }}
			</Typography>
		</Row>
		<IconButton v-if="dismissible" class="toast-close" :icon="{ name: 'cross', size: 12 }" w="56" h="56" link
			@click="emit('close')" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Typography from '../elements/Typography.vue'
import Icon from '../elements/Icon.vue'
import Row from '../layout/Row.vue'
import IconButton from '../elements/IconButton.vue'
import type { PayloadToast } from '../../composables/overlays/toast'

// Props ---------------------------
const props = withDefaults(defineProps<{
	message: string
	type?: PayloadToast['type']
	icon?: string
	dismissible?: boolean
}>(), {
	type: 'text',
	icon: '',
	dismissible: true,
})

// Emits ---------------------------
const emit = defineEmits(['close'])

// Computed ---------------------------
const classes = computed(() => {
	return {
		[`_${props.type}`]: true,
		'_dismissible': props.dismissible,
		'_non-dismissible': !props.dismissible,
	}
})
</script>

<style lang="scss">
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.toast'; // コンポーネントセレクタ名

#{$cn} {
	position: relative;
	width: 100%;
	padding: 20px 56px 20px 20px;
	border-radius: 8px;
	background-color: var(--color-text-005);
	backdrop-filter: blur(40px);
	pointer-events: auto;

	&._non-dismissible {
		padding: 20px;
	}

	&-icon {
		transform: translateY(-1.2px);
	}

	&-close {
		position: absolute;
		right: 0;
		top: 0;
	}
}
</style>

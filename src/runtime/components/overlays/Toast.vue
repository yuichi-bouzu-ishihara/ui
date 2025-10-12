<template>
	<Row class="toast" :class="classes" align="stretch" nowrap fit-w>
		<!-- 画像がある場合 -->
		<Ratio v-if="image" class="toast-image">
			<Image :src="image.src" :alt="message" class="toast-image-inner" />
			<div v-if="image.processing" class="toast-image-spinner">
				<Spinner size="16" />
			</div>
		</Ratio>
		<Row class="toast-content" gap="12" align="center" nowrap fit-w>
			<!-- アイコンの場合 -->
			<Icon v-if="icon" class="toast-icon" :name="icon" size="18" :color="type === 'error' ? 'danger' : 'text'" />
			<Typography caption2 bold cap-height-baseline lineclamp="1" :color="type === 'error' ? 'danger' : 'text'">
				{{ message }}
			</Typography>
		</Row>
		<IconButton v-if="dismissible" class="toast-close" :icon="{ name: 'cross', size: 12 }" w="56" h="56" link
			@click="emit('close')" />
	</Row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Typography from '../elements/Typography.vue'
import Icon from '../elements/Icon.vue'
import Row from '../layout/Row.vue'
import IconButton from '../elements/IconButton.vue'
import Spinner from '../elements/Spinner.vue'
import type { PayloadToast } from '../../composables/overlays/toast'

// Props ---------------------------
const props = withDefaults(defineProps<{
	message: string
	type?: PayloadToast['type']
	icon?: string
	dismissible?: boolean
	image?: PayloadToast['image']
}>(), {
	type: 'text',
	icon: '',
	dismissible: true,
	image: undefined,
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
	border-radius: 8px;
	background-color: var(--color-background-090);
	backdrop-filter: blur(40px);
	pointer-events: auto;
	overflow: hidden;

	&-content {
		padding: 20px 56px 20px 20px;
	}

	&._non-dismissible &-content {
		padding: 20px;
	}

	&-icon {
		transform: translateY(-1.2px);
	}

	&-image {
		position: relative;
		top: -2px;
		bottom: -2px;
		max-width: 80px;

		&-inner {
			position: absolute;
		}

		&-spinner {
			position: absolute;
			inset: 0;
			background-color: rgba(black, 0.5);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	&-close {
		position: absolute;
		right: 0;
		top: 0;
	}
}
</style>

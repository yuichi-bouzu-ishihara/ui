<template>
	<Clickable class="toast" :class="classes" :disabled="!click" @click="click && click()">
		<Row class="toast" :class="classes" align="stretch" nowrap fit-w>
			<!-- 画像がある場合 -->
			<Ratio v-if="image" class="toast-image">
				<Image :src="image.src" :alt="message" class="toast-image-inner" />
				<div v-if="image.processing || image.icon" class="toast-image-icon">
					<Spinner v-if="image.processing" size="16" color="var(--toast-color-text)" />
					<Icon v-else :name="image.icon" size="16" color="var(--toast-color-text)" />
				</div>
			</Ratio>
			<Row class="toast-content" gap="12" align="center" nowrap fit-w>
				<!-- アイコンの場合 -->
				<Icon v-if="icon" class="toast-icon" :name="icon" size="18"
					:color="type === 'error' ? 'danger' : 'var(--toast-color-text)'" />
				<Typography class="toast-content-txt" caption2 bold cap-height-baseline unselectable lineclamp="1"
					:color="type === 'error' ? 'danger' : 'var(--toast-color-text)'">
					{{ message }}
				</Typography>
			</Row>
			<Clickable v-if="dismissible" class="toast-close" @click="emit('close')">
				<Box w="56" h="56">
					<Center>
						<Icon name="cross" size="12" color="var(--toast-color-text)" />
					</Center>
				</Box>
			</Clickable>
		</Row>
	</Clickable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Typography from '../elements/Typography.vue'
import Icon from '../elements/Icon.vue'
import Row from '../layout/Row.vue'
import Clickable from '../elements/Clickable.vue'
import Spinner from '../elements/Spinner.vue'
import type { PayloadToast } from '../../composables/overlays/toast'

// Props ---------------------------
const props = withDefaults(defineProps<{
	message: string
	type?: PayloadToast['type']
	icon?: string
	dismissible?: boolean
	image?: PayloadToast['image']
	click?: () => void
}>(), {
	type: 'text',
	icon: '',
	dismissible: true,
	image: undefined,
	click: undefined,
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
	background-color: var(--toast-color-background);
	backdrop-filter: blur(40px);
	box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.3);
	pointer-events: auto;
	overflow: hidden;

	&-content {
		padding: 20px 56px 20px 20px;

		&-txt {
			transform: translateY(-2.0px);
		}
	}

	&._non-dismissible &-content {
		padding: 20px;
	}

	&-icon {
		transform: translateY(-1.2px);
	}

	&-image {
		position: relative;
		max-width: 80px;

		&-inner {
			position: absolute;
		}

		&-icon {
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

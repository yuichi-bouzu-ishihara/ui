<template>
	<Column class="avatarCropper" justify="center" gap="20">
		<Box w="100%" relative>
			<Row justify="center" align="center">
				<Cropper ref="cropper" v-model="transform" :src="value" :trim-width="trimSize" :trim-height="trimSize"
					:output-width="outputSize" :output-height="outputSize" trim-style="avatar" />
			</Row>
		</Box>
		<Box class="avatarCropper-ui" :class="{ _disabled: !src && !value }" w="100%" :max-w="`calc(${trimSize}px + 24px)`">
			<InputRange v-model="transform.scale" :step="ZOOM_BTN_STEP" min="1" :max="ZOOM_MAX" :disabled="!src" controls />
		</Box>
	</Column>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import InputRange from './InputRange.vue'
import Cropper from './Cropper.vue'
import type { Value } from './Cropper.vue'
import Box from '../layout/Box.vue'
import Row from '../layout/Row.vue'
import Column from '../layout/Column.vue'

// Constants ---------------------
const ZOOM_MAX = 3
const ZOOM_BTN_STEP = 0.25
const TRANSFORM_DEFAULT = { position: { x: 0, y: 0 }, scale: 1 }

// Props ------------------
const props = defineProps({
	src: { type: String, default: '' },
	trimSize: { type: Number, default: 280 },
	outputSize: { type: Number, default: 280 },
})

// Emits ---------------------
const emit = defineEmits(['change'])

// Data ---------------------
const transform = ref<Value>({ ...TRANSFORM_DEFAULT })
const value = ref<string>(props.src)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cropper = ref<any>(null)

// Methods ---------------------
const capture = async () => {
	return cropper.value.capture()
}

// Expose ---------------------
defineExpose({ capture })

// Watchers ---------------------
watch(
	() => transform.value,
	() => {
		if (JSON.stringify(transform.value) !== JSON.stringify(TRANSFORM_DEFAULT)) {
			emit('change', value.value)
		}
	},
	{ deep: true },
)
</script>

<style lang="scss">
$cn: '.avatarCropper'; // コンポーネントクラス名

#{$cn} {
	position: relative;
	z-index: 0;
	width: 100%;
	height: 100%;

	&-menu {
		position: absolute;
		inset: 0;
		margin: auto;
		background-color: var(--color-dark-030);
	}

	&-ui {
		&._disabled {
			opacity: 0.6;
			pointer-events: none;
		}
	}
}
</style>

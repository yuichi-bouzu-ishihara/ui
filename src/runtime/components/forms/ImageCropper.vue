<template>
	<Column class="imageCropper" justify="center" gap="20" fit>
		<Box w="100%" relative>
			<Row justify="center" align="center">
				<Cropper :key="`imageCropper-cropper-${changeDate}`" ref="cropper" v-model="transform" :src="value"
					v-bind="{ trimWidth, trimHeight, outputWidth, outputHeight }" />
			</Row>
			<template v-if="changeRequired && !isImageChange">
				<Center class="imageCropper-menu">
					<template v-if="src">
						<IconButton :icon="{ name: 'image', size: 24 }" link large @click="select" />
					</template>
					<template v-else>
						<Button info :w="trimWidth" :h="trimHeight" @click="select">
							画像ファイルを選択する
						</Button>
					</template>
				</Center>
			</template>
		</Box>
		<template v-if="value">
			<InputRange v-model="transform.scale" :step="ZOOM_BTN_STEP" min="1" :max="ZOOM_MAX"
				:disabled="changeRequired && !isImageChange" controls />
		</template>
	</Column>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFile } from '../../composables/file'
import InputRange from '../forms/InputRange.vue'
import Cropper from './Cropper.vue'
import type { Value } from './Cropper.vue'
import Box from '../layout/Box.vue'
import Row from '../layout/Row.vue'
import Center from '../layout/Center.vue'
import IconButton from '../elements/IconButton.vue'
import Button from '../elements/Button.vue'

// Stores & Composables ---------------------
const file = useFile()

// Emits ---------------------
const emit = defineEmits(['change'])

// Expose ---------------------
const capture = async () => {
	return cropper.value.capture()
}
defineExpose({ capture })

// Constants ---------------------
const ZOOM_MAX = 3
const ZOOM_BTN_STEP = 0.25

// Props ------------------
const props = defineProps({
	src: { type: String, default: '' },
	trimWidth: { type: Number, default: 0 },
	trimHeight: { type: Number, default: 0 },
	outputWidth: { type: Number, default: 0 }, // 出力画像の横幅サイズ
	outputHeight: { type: Number, default: 0 }, // 出力画像の縦幅サイズ
	changeRequired: { type: Boolean, default: true }, // 変更が必須かどうか。
})

// Data ---------------------
const isImageChange = ref(false)
const transform = ref<Value>({ position: { x: 0, y: 0 }, scale: 1 })
const value = ref<string>(props.src)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cropper = ref<any>(null)
const changeDate = ref(0)

// Methods ---------------------
const select = async () => {
	const selectFile = await file.select()
	if (selectFile?.blob) {
		value.value = await file.encode(selectFile.blob)
		isImageChange.value = true
		changeDate.value = Date.now()
		emit('change', { base64: value.value, transform: transform.value })
	}
}

// Watch ---------------------
watch(() => props.src, (nv, ov) => {
	if (nv !== ov) {
		changeDate.value = Date.now()
		isImageChange.value = true
	}
}, { immediate: true })
</script>

<style lang="scss">
$cn: '.imageCropper'; // コンポーネントクラス名

#{$cn} {
	position: relative;
	z-index: 0;

	&-menu {
		position: absolute;
		inset: 0;
		margin: auto;
		background-color: var(--color-dark-030);
	}
}
</style>

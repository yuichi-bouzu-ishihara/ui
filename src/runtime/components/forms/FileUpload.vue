<template>
	<div class="fileUpload" :class="{ _invalid: isInvalid }">
		<Clickable ref="dropAreaRef" class="fileUpload-ui" :class="{ _dragover: isDragOver }" @click="onUpload">
			<Ratio>
				<Column justify="center" gap="12">
					<Icon v-if="icon" :name="icon.name" :size="icon.size" :color="isInvalid ? 'danger' : 'text'" />
					<Typography caption1 extrabold cap-height-baseline :color="isInvalid ? 'danger' : 'text'">
						{{ isDragOver ? 'Drop files here' : label }}
					</Typography>
					<Typography caption1 cap-height-baseline :color="isInvalid ? 'danger' : 'text-060'">
						{{ description }}
					</Typography>
				</Column>
			</Ratio>
		</Clickable>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type PropType } from 'vue'
import { useFile, useFileDrop } from '#imports'

// Types ----------
type Icon = {
	name: string
	size: number
}

// Composables ----------
const { watch, destroy } = useFileDrop()

// Models ----------
const model = defineModel<File | null>({ default: () => null })

// Props ----------
const props = defineProps({
	accept: { type: String, default: '' }, // ファイルの種類を指定。カンマ区切りで指定。image,video,audio,document,etc
	icon: { type: Object as PropType<Icon | null>, default: () => null },
	label: { type: String, default: 'Drop your file here' },
	description: { type: String, default: 'under 5MB' },
})

// Data ----------
const dropAreaRef = ref<HTMLElement>()
const isDragOver = ref(false)
const isInvalid = ref(false)

// Methods ----------
const onUpload = async () => {
	console.log('upload')
	const acceptTypes = props.accept ? props.accept.split(',').map(type => type.trim()).filter(type => type) : []
	const selectFile = await useFile().select(acceptTypes)
	if (selectFile) {
		model.value = selectFile.file as unknown as File
		isInvalid.value = false
	}
}

const handleFileDrop = (state: string, files: File[] | null) => {
	switch (state) {
		case 'dragover':
			isDragOver.value = true
			break
		case 'dragleave':
			isDragOver.value = false
			break
		case 'drop':
			isDragOver.value = false
			if (files && files.length > 0) {
				// ファイルタイプの検証
				const validFiles = files.filter((file) => {
					if (!props.accept) return true
					const acceptedTypes = props.accept.split(',').map(type => type.trim()).filter(type => type)
					if (acceptedTypes.length === 0) return true
					return acceptedTypes.some((type) => {
						if (type.startsWith('.')) {
							return file.name.toLowerCase().endsWith(type.toLowerCase())
						}
						return file.type.startsWith(type)
					})
				})

				console.log('validFiles', validFiles)

				if (validFiles.length > 0) {
					model.value = validFiles[0]
					isInvalid.value = false
				}
				else {
					isInvalid.value = true
				}
			}
			break
		case 'destroy':
			isDragOver.value = false
			break
	}
}

onMounted(() => {
	watch('.fileUpload-ui', handleFileDrop)
})

onUnmounted(() => {
	destroy()
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
$cn: '.fileUpload'; // コンポーネントクラス名

#{$cn} {
	&-ui {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 1px dashed var(--color-text-020);
		border-radius: #{var.$border-radius-medium}px;
		padding: var(--container-min-side-space);
		transition: var.$transition-base;
		cursor: pointer;

		&:hover {
			border-color: var(--color-text-060);
		}

		&._dragover {
			border-color: var(--color-text-060);
			background-color: var(--color-text-005);
			transform: scale(1.02);
		}
	}

	&._invalid {
		#{$cn}-ui {
			border-color: var(--color-danger-060);
		}
	}
}
</style>

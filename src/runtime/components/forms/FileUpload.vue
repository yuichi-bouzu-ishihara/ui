<template>
	<div class="fileUpload" :class="{ _invalid: isInvalid, _loading: isLoading }">
		<Clickable ref="dropAreaRef" class="fileUpload-ui" :class="{ _dragover: isDragOver }" @click="onUpload">
			<Ratio>
				<Column justify="center" gap="12">
					<Icon v-if="fileStatus === 'idle' && icon" :name="icon.name" :size="icon.size || ICON_SIZE" />
					<Spinner v-else-if="fileStatus === 'loading'" :size="icon?.size || ICON_SIZE" />
					<Icon v-else-if="fileStatus === 'success'" name="checkCircleLine" :size="icon?.size || ICON_SIZE"
						color="success" />
					<Icon v-else-if="fileStatus === 'error'" name="exclamation" :size="icon?.size || ICON_SIZE" color="danger" />
					<Typography caption1 extrabold cap-height-baseline :color="isInvalid ? 'danger' : 'text'">
						{{ getStatusText() }}
					</Typography>
					<Typography caption1 cap-height-baseline :color="isInvalid ? 'danger' : 'text-060'">
						{{ getDescriptionText() }}
					</Typography>
					<!-- ファイル読み込み中のプログレス表示 -->
					<!-- <div v-if="isLoading" class="fileUpload-progress">
						<Spinner size="small" />
						<Typography caption2 :color="'text-060'">
							{{ loadingMessage }}
						</Typography>
					</div> -->
					<!-- 選択されたファイル情報 -->
					<!-- <div v-if="selectedFile && !isLoading" class="fileUpload-fileInfo">
						<Typography caption2 :color="'text-060'">
							{{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
						</Typography>
					</div> -->
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
type FileStatus = 'idle' | 'loading' | 'success' | 'error'

// Constants ----------
const ICON_SIZE = 20

// Composables ----------
const { watch, destroy } = useFileDrop()

// Models ----------
const model = defineModel<File | null>({ default: () => null })

// Props ----------
const props = defineProps({
	accept: { type: String, default: '' },
	icon: { type: Object as PropType<Icon | null>, default: () => null },
	label: { type: String, default: 'Drop your file here' },
	description: { type: String, default: 'under 5MB' },
	maxSize: { type: Number, default: 5 * 1024 * 1024 }, // デフォルト5MB
})

// Data ----------
const dropAreaRef = ref<HTMLElement>()
const isDragOver = ref(false)
const isInvalid = ref(false)
const isLoading = ref(false)
const fileStatus = ref<FileStatus>('idle')
const selectedFile = ref<File | null>(null)
const errorMessage = ref('')
const loadingMessage = ref('')

// Computed ----------
const getStatusText = () => {
	if (isDragOver.value) return 'Drop files here'
	if (isLoading.value) return 'Processing file...'
	if (fileStatus.value === 'error') return 'File upload failed'
	if (selectedFile.value) return 'File selected'
	return props.label
}

const getDescriptionText = () => {
	if (fileStatus.value === 'error') return errorMessage.value
	if (isLoading.value) return loadingMessage.value
	if (selectedFile.value) return 'Click to select another file'
	return props.description
}

// Methods ----------
const onUpload = async () => {
	const acceptTypes = props.accept ? props.accept.split(',').map(type => type.trim()).filter(type => type) : []
	const { file } = await useFile().select(acceptTypes) as { file: File }
	if (file) {
		await selectFile(file)
	}
}

const handleFileDrop = async (state: string, files: File[] | null) => {
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
				// useFileDropで既にファイルタイプ検証済みなので、そのまま使用
				await selectFile(files[0])
			}
			break
		case 'error':
			isDragOver.value = false
			setError('Invalid file type')
			break
		case 'destroy':
			isDragOver.value = false
			break
	}
}

const selectFile = async (file: File) => {
	try {
		// ファイルサイズチェック
		if (file.size > props.maxSize) {
			setError(`File size exceeds ${formatFileSize(props.maxSize)} limit`)
			return
		}

		// ファイル読み込み状態を開始
		isLoading.value = true
		loadingMessage.value = 'Validating file...'
		fileStatus.value = 'loading'
		isInvalid.value = false
		errorMessage.value = ''

		// ファイルの読み込み可能性をチェック
		await validateFile(file)

		// ファイルが正常に読み込めることを確認
		loadingMessage.value = 'Finalizing...'

		// 少し待機してユーザーに処理中であることを示す
		await new Promise(resolve => setTimeout(resolve, 500))

		// 成功状態に設定
		selectedFile.value = file
		model.value = file
		fileStatus.value = 'success'
		isLoading.value = false
		isInvalid.value = false
	}
	catch (error) {
		setError(error instanceof Error ? error.message : 'Failed to process file')
	}
}

const validateFile = async (file: File): Promise<void> => {
	return new Promise((resolve, reject) => {
		// ファイルが存在するかチェック
		if (!file || file.size === 0) {
			reject(new Error('File is empty or corrupted'))
			return
		}

		// ファイルの読み込みテスト
		const reader = new FileReader()

		reader.onload = () => {
			resolve()
		}

		reader.onerror = () => {
			reject(new Error('Failed to read file'))
		}

		reader.onabort = () => {
			reject(new Error('File reading was aborted'))
		}

		// ファイルの一部を読み込んでテスト（大きなファイルの場合の対策）
		const chunkSize = Math.min(file.size, 1024 * 1024) // 1MBまで
		const blob = file.slice(0, chunkSize)
		reader.readAsArrayBuffer(blob)
	})
}

const setError = (message: string) => {
	errorMessage.value = message
	fileStatus.value = 'error'
	isInvalid.value = true
	isLoading.value = false
	selectedFile.value = null
	model.value = null
}

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Lifecycle ----------
onMounted(() => {
	// acceptプロパティをuseFileDropのacceptsパラメータに変換
	const { parseAccepts } = useFile()
	const acceptTypes = props.accept ? parseAccepts(props.accept) : ['image']
	watch('.fileUpload-ui', handleFileDrop, acceptTypes)
})
onUnmounted(() => {
	destroy()
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
$cn: '.fileUpload';

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

	&-progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
	}

	&-fileInfo {
		margin-top: 8px;
		padding: 8px 12px;
		background-color: var(--color-text-005);
		border-radius: #{var.$border-radius-small}px;
		border: 1px solid var(--color-text-020);
	}

	&._invalid {
		#{$cn}-ui {
			border-color: var(--color-danger-060);
		}
	}

	&._loading {
		#{$cn}-ui {
			border-color: var(--color-primary-060);
			background-color: var(--color-primary-005);
		}
	}
}
</style>

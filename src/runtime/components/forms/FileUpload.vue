<template>
	<div class="fileUpload" :class="{ _invalid: isInvalid, _loading: isLoading }">
		<Clickable ref="dropAreaRef" class="fileUpload-ui" :class="{ _dragover: isDragOver }" @click="onUpload">
			<Ratio>
				<Column justify="center">
					<Icon v-if="fileStatus === 'idle' && icon" :name="icon.idle.name" :size="icon.idle.size || ICON_SIZE" />
					<template v-else-if="fileStatus === 'loading'">
						<Spinner v-if="icon.loading.name === 'spinner'" :size="icon.loading.size || ICON_SIZE" />
						<Icon v-else :name="icon.loading.name" :size="icon.loading.size || ICON_SIZE" />
					</template>
					<Icon v-else-if="fileStatus === 'success'" name="checkCircleLine" :size="icon.success.size || ICON_SIZE"
						color="success" />
					<Icon v-else-if="fileStatus === 'error'" name="exclamation" :size="icon.error.size || ICON_SIZE"
						color="danger" />
					<TransitionAcordion>
						<div v-if="getStatusText">
							<Box h="12" />
							<Typography caption1 extrabold center cap-height-baseline :color="isInvalid ? 'danger' : 'text'">
								<!-- eslint-disable-next-line vue/no-v-html -->
								<span v-html="getStatusText" />
							</Typography>
						</div>
					</TransitionAcordion>
					<TransitionAcordion>
						<div v-if="getDescriptionText">
							<Box h="12" />
							<Typography caption1 center cap-height-baseline :color="isInvalid ? 'danger' : 'text-060'">
								<!-- eslint-disable-next-line vue/no-v-html -->
								<span v-html="getDescriptionText" />
							</Typography>
						</div>
					</TransitionAcordion>
				</Column>
			</Ratio>
		</Clickable>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type PropType, computed } from 'vue'
import { useFile, useFileDrop } from '#imports'

// Types ----------
type Icon = {
	name: string
	size?: number
}
type FileStatus = 'idle' | 'loading' | 'success' | 'error'
type StatusIcon = {
	idle: Icon
	loading: Icon
	success: Icon
	error: Icon
}
type StatusText = {
	idle: string
	loading: string
	success: string
	error: string
}

// Constants ----------
const ICON_SIZE = 20

// Composables ----------
const { watch, destroy } = useFileDrop()

// Models ----------
const model = defineModel<File | null>({ default: () => null })

// Emits ----------
const emit = defineEmits<{
	'metadata-loaded': [metadata: {
		width?: number // 画像・動画の場合のみ
		height?: number // 画像・動画の場合のみ
		aspectRatio?: number // 画像・動画の場合のみ
		fileSize: number
		mimeType: string
		duration?: number // 動画の場合のみ
	}]
	'metadata-error': [error: string]
	'metadata-loading': [loading: boolean]
}>()

// Props ----------
const props = defineProps({
	accept: { type: String, default: '' },
	icon: { type: Object as PropType<StatusIcon>, default: () => ({ idle: { name: 'upload' }, loading: { name: 'spinner' }, success: { name: 'checkCircleLine' }, error: { name: 'exclamation' } }) },
	label: { type: Object as PropType<StatusText>, default: () => ({ idle: 'Drop your file here', loading: 'Processing file...', success: 'File selected', error: 'File upload failed' }) },
	description: { type: Object as PropType<StatusText>, default: () => ({ idle: 'under 5MB', loading: 'Validating file...', success: 'Click to select another file', error: 'Invalid file type' }) },
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
const metadata = ref<{
	width?: number
	height?: number
	duration?: number
	aspectRatio?: number
	fileSize: number
	mimeType: string
} | null>(null)
const metadataError = ref<string | null>(null)
const isMetadataLoading = ref(false)

// Computed ----------
const getStatusText = computed(() => {
	if (isDragOver.value) return props.label.idle
	if (fileStatus.value === 'error') return props.label.error
	if (isLoading.value) return props.label.loading
	if (selectedFile.value) return props.label.success
	return props.label.idle
})

const getDescriptionText = computed(() => {
	if (isDragOver.value) return props.description.idle
	if (fileStatus.value === 'error') return props.description.error
	if (selectedFile.value) return props.description.success
	if (isLoading.value) return props.description.loading
	return props.description.idle
})

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
		loadingMessage.value = props.label.loading
		fileStatus.value = 'loading'
		isInvalid.value = false
		errorMessage.value = ''

		// ファイルの読み込み可能性をチェック
		await validateFile(file)

		// ファイルが正常に読み込めることを確認
		loadingMessage.value = props.label.loading

		// 少し待機してユーザーに処理中であることを示す
		await new Promise(resolve => setTimeout(resolve, 500))

		// ファイル選択完了（メタデータ読み込み前）
		selectedFile.value = file
		isInvalid.value = false

		// メタデータを取得
		await loadMetadata(file)
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
	// メタデータもクリア
	metadata.value = null
	metadataError.value = null
	isMetadataLoading.value = false
	emit('metadata-loading', false)
}

const loadMetadata = async (file: File) => {
	isMetadataLoading.value = true
	isLoading.value = true
	fileStatus.value = 'loading'
	metadataError.value = null
	metadata.value = null
	emit('metadata-loading', true)

	try {
		const { getImageMetadata, getVideoMetadata } = useFile()

		// ファイルタイプに応じてメタデータを取得
		if (file.type.startsWith('image/')) {
			const meta = await getImageMetadata(file)
			metadata.value = meta
			emit('metadata-loaded', meta)
		}
		else if (file.type.startsWith('video/')) {
			const meta = await getVideoMetadata(file)
			metadata.value = meta
			emit('metadata-loaded', meta)
		}
		else {
			// その他のファイルタイプ（テキスト、ドキュメントなど）の基本メタデータ
			const basicMetadata = {
				fileSize: file.size,
				mimeType: file.type,
			}
			metadata.value = basicMetadata
			emit('metadata-loaded', basicMetadata)
		}

		// メタデータ読み込み成功時（またはメタデータ不要なファイル）のみmodelに反映
		model.value = file
		fileStatus.value = 'success'
	}
	catch (err) {
		const errorMsg = err instanceof Error ? err.message : 'Failed to load metadata'
		metadataError.value = errorMsg
		emit('metadata-error', errorMsg)

		// メタデータ読み込みエラー時はmodelをクリア
		model.value = null
		fileStatus.value = 'error'
		isInvalid.value = true
		errorMessage.value = errorMsg
	}
	finally {
		isMetadataLoading.value = false
		isLoading.value = false
		emit('metadata-loading', false)
	}
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

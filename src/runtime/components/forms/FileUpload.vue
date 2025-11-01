<template>
	<div class="fileUpload" :class="{ _invalid: isInvalid, _loading: isLoading }">
		<Clickable ref="dropAreaRef" class="fileUpload-ui" :class="{ _dragover: isDragOver }" @click="onUpload">
			<Ratio>
				<Column justify="center" gap="12">
					<Icon v-if="fileStatus === 'idle' && mergedIcon.idle" :name="mergedIcon.idle.name"
						:size="mergedIcon.idle.size || ICON_SIZE" />
					<template v-else-if="fileStatus === 'loading' && mergedIcon.loading">
						<Spinner v-if="mergedIcon.loading.name === 'spinner'" :size="mergedIcon.loading.size || ICON_SIZE" />
						<Icon v-else :name="mergedIcon.loading.name" :size="mergedIcon.loading.size || ICON_SIZE" />
					</template>
					<Icon v-else-if="fileStatus === 'success' && mergedIcon.success" name="checkCircleLine"
						:size="mergedIcon.success.size || ICON_SIZE" color="success" />
					<Icon v-else-if="fileStatus === 'error' && mergedIcon.error" name="exclamation"
						:size="mergedIcon.error.size || ICON_SIZE" color="danger" />
					<Typography v-if="getStatusText" caption1 extrabold center cap-height-baseline
						:color="isInvalid ? 'danger' : 'text'">
						<!-- eslint-disable-next-line vue/no-v-html -->
						<span v-html="getStatusText" />
					</Typography>
					<Typography v-if="getDescriptionText" caption1 center cap-height-baseline
						:color="isInvalid ? 'danger' : 'text-060'">
						<!-- eslint-disable-next-line vue/no-v-html -->
						<span v-html="getDescriptionText" />
					</Typography>
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
	idle?: Icon
	loading?: Icon
	success?: Icon
	error?: Icon
}
type StatusText = {
	idle?: string
	loading?: string
	success?: string
	error?: string
}
export type FileUploadMetadata = {
	width?: number
	height?: number
	aspectRatio?: number
	fileSize: number
	mimeType: string
	duration?: number
}

// Constants ----------
const ICON_SIZE = 20

// Composables ----------
const { formatFileSize } = useFile()
const { watch, destroy } = useFileDrop()

// Models ----------
const model = defineModel<File | null>({ default: () => null })

// Emits ----------
const emit = defineEmits<{
	'metadata-loaded': [metadata: FileUploadMetadata]
	'metadata-error': [error: string]
	'metadata-loading': [loading: boolean]
}>()

// Props ----------
const props = defineProps({
	/**
	 * 許可するファイルタイプを指定。カンマ区切りで複数指定可能
	 * @example 'image/*' (すべての画像)
	 * @example 'image/jpeg,image/png' (JPEGとPNGのみ)
	 * @example '.pdf,.doc,.docx' (拡張子指定)
	 * @example 'image,video' (事前定義カテゴリ: image/*, video/*)
	 * @example 'image/jpeg,video/mp4,.pdf' (MIMEタイプと拡張子の混在)
	 * @example 'image', 'video', 'audio', 'document', 'text' (事前定義カテゴリ)
	 */
	accept: { type: String, default: '' },
	icon: { type: Object as PropType<StatusIcon>, default: () => ({}) },
	label: { type: Object as PropType<StatusText>, default: () => ({}) },
	description: { type: Object as PropType<StatusText>, default: () => ({}) },
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
const metadata = ref<FileUploadMetadata | null>(null)
const metadataError = ref<string | null>(null)
const isMetadataLoading = ref(false)

// Computed ----------
const defaultIcon = computed(() => ({
	idle: { name: 'upload' },
	loading: { name: 'spinner' },
	success: { name: 'checkCircleLine' },
	error: { name: 'exclamation' },
}))

const defaultLabel = computed(() => ({
	idle: 'ファイルを選択してください',
	loading: 'ファイルを読み込み中です...',
	success: 'ファイルの読み込みが完了しました',
	error: '', // エラー時は動的に生成
}))
const defaultDescription = computed(() => ({
	idle: `${formatFileSize(props.maxSize)}以内の${getAllowedFileTypes()}ファイルを選択してください`,
	loading: 'ファイルを検証中です...',
	success: '別のファイルを選択するにはクリックしてください',
	error: '', // エラー時は動的に生成
}))

const mergedIcon = computed(() => ({
	...defaultIcon.value,
	...props.icon,
}))

const mergedLabel = computed(() => ({
	...defaultLabel.value,
	...props.label,
}))

const mergedDescription = computed(() => ({
	...defaultDescription.value,
	...props.description,
}))

// 許可されているファイル形式の情報を取得する関数
const getAllowedFileTypes = () => {
	if (!props.accept) return ''

	const { parseAccepts } = useFile()
	const acceptTypes = parseAccepts(props.accept)

	// 人間が読みやすい形式に変換
	const readableTypes: string[] = []

	acceptTypes.forEach((accept) => {
		if (accept === 'image') {
			readableTypes.push('画像')
		}
		else if (accept === 'video') {
			readableTypes.push('動画')
		}
		else if (accept === 'audio') {
			readableTypes.push('音声')
		}
		else if (accept === 'document') {
			readableTypes.push('ドキュメント')
		}
		else if (accept === 'text') {
			readableTypes.push('テキスト')
		}
		else if (accept.startsWith('.')) {
			readableTypes.push(accept.toUpperCase())
		}
		else if (accept.includes('/')) {
			// MIMEタイプの場合、拡張子に変換
			if (accept === 'image/jpeg' || accept === 'image/jpg') {
				readableTypes.push('JPEG')
			}
			else if (accept === 'image/png') {
				readableTypes.push('PNG')
			}
			else if (accept === 'image/webp') {
				readableTypes.push('WebP')
			}
			else if (accept === 'video/mp4') {
				readableTypes.push('MP4')
			}
			else if (accept === 'application/pdf') {
				readableTypes.push('PDF')
			}
			else {
				readableTypes.push(accept)
			}
		}
	})

	// 重複を除去
	const uniqueTypes = [...new Set(readableTypes)]

	return uniqueTypes.length > 0 ? uniqueTypes.join(', ') : ''
}

// エラー時のテキスト生成関数
const getErrorLabel = () => {
	if (props.label.error && props.label.error !== '') {
		return props.label.error
	}
	return 'ファイルの読み込み中にエラーが発生しました'
}

const getErrorDescription = () => {
	if (props.description.error && props.description.error !== '') {
		return props.description.error
	}

	const baseMessage = errorMessage.value || 'ファイルの形式を確認してください'
	const allowedTypes = `許可されている形式: ${getAllowedFileTypes()}`

	if (allowedTypes && errorMessage.value?.includes('無効なファイル形式')) {
		return `${baseMessage}。<br>${allowedTypes}`
	}

	return baseMessage
}

const getStatusText = computed(() => {
	if (isDragOver.value) return mergedLabel.value.idle
	if (fileStatus.value === 'error') return getErrorLabel()
	if (isLoading.value) return mergedLabel.value.loading
	if (selectedFile.value) return mergedLabel.value.success
	return mergedLabel.value.idle
})

const getDescriptionText = computed(() => {
	if (isDragOver.value) return mergedDescription.value.idle
	if (fileStatus.value === 'error') return getErrorDescription()
	if (selectedFile.value) return mergedDescription.value.success
	if (isLoading.value) return mergedDescription.value.loading
	return mergedDescription.value.idle
})

// Methods ----------
const onUpload = async () => {
	const acceptTypes = props.accept ? props.accept.split(',').map(type => type.trim()).filter(type => type) : []
	const res = await useFile().select(acceptTypes) as { file: File }
	// ファイルが選択されなかった場合（キャンセル）は何もしない
	if (res && res.file) {
		await selectFile(res.file)
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
			setError('無効なファイル形式です')
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
			setError(`ファイルサイズが${formatFileSize(props.maxSize)}の制限を超えています`)
			return
		}

		// ファイル読み込み状態を開始
		isLoading.value = true
		loadingMessage.value = mergedLabel.value.loading ?? ''
		fileStatus.value = 'loading'
		isInvalid.value = false
		errorMessage.value = ''

		// ファイルの読み込み可能性をチェック
		await validateFile(file)

		// ファイルが正常に読み込めることを確認
		loadingMessage.value = mergedLabel.value.loading ?? ''

		// 少し待機してユーザーに処理中であることを示す
		await new Promise(resolve => setTimeout(resolve, 500))

		// ファイル選択完了（メタデータ読み込み前）
		selectedFile.value = file
		isInvalid.value = false

		// メタデータを取得
		await loadMetadata(file)
	}
	catch (error) {
		setError(error instanceof Error ? error.message : 'ファイルの処理に失敗しました')
	}
}

const validateFile = async (file: File): Promise<void> => {
	return new Promise((resolve, reject) => {
		// ファイルが存在するかチェック
		if (!file || file.size === 0) {
			reject(new Error('ファイルが空か破損しています'))
			return
		}

		// ファイルの読み込みテスト
		const reader = new FileReader()

		reader.onload = () => {
			resolve()
		}

		reader.onerror = () => {
			reject(new Error('ファイルの読み込みに失敗しました'))
		}

		reader.onabort = () => {
			reject(new Error('ファイルの読み込みが中断されました'))
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
			const basicMetadata: FileUploadMetadata = {
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
		const errorMsg = err instanceof Error ? err.message : 'メタデータの読み込みに失敗しました'
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
			border-color: var(--color-text-060);
			background-color: var(--color-text-005);
		}
	}
}
</style>

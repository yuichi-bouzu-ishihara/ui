<template>
	<Container class="pageFormsFileUpload" narrow>
		<Column gap="40">
			<FileUpload v-model="selectedFile" accept="image/jpg,image/jpeg,image/png,video/mp4"
				:icon="{ success: { name: 'checkCircleLine' }, error: { name: 'exclamation' } }"
				:label="{ idle: 'ファイルを選択してください。', loading: '', success: 'ファイルの読み込みが完了しました。', error: 'ファイルの読み込み中にエラーが発生しました。' }"
				:description="{ idle: '5GB以内の .jpg .jpeg .png .mp4 のファイルを選択してください。', loading: '', success: '', error: 'ファイルの拡張子や、ファイルが壊れていないか確認してください。' }"
				:max-size="5 * 1024 * 1024 * 1024" @metadata-loaded="handleMetadataLoaded" @metadata-error="handleMetadataError"
				@metadata-loading="handleMetadataLoading" />
			<template v-if="selectedFile">
				<Image v-if="isImage" v-bind="{ src }" />
				<video v-else-if="isVideo" v-bind="{ src }" />
				<Tooltip v-if="!error" :text="getFileInfoTooltipText()">
					<Row justify="center" align="center" gap="8">
						<Typography caption3 extrabold>
							File Info
						</Typography>
						<Icon name="info" size="16" />
					</Row>
				</Tooltip>
				<Tooltip v-else :text="error">
					<Row justify="center" align="center" gap="8">
						<Typography caption3 extrabold color="danger">
							Error
						</Typography>
						<Icon name="exclamation" size="16" color="danger" />
					</Row>
				</Tooltip>
			</template>
		</Column>
	</Container>
</template>

<script setup lang="ts">
const selectedFile = ref<File | null>(null)
const metadata = ref<{
	width?: number
	height?: number
	aspectRatio?: number
	fileSize: number
	mimeType: string
	duration?: number
} | null>(null)
const error = ref<string | null>(null)
const loading = ref(false)

// Computed ----------
const isImage = computed(() => selectedFile.value?.type.startsWith('image/'))
const isVideo = computed(() => selectedFile.value?.type.startsWith('video/'))
const src = computed(() => selectedFile.value ? URL.createObjectURL(selectedFile.value) : '')
const getFileInfoTooltipText = () => {
	let text = `File Name: ${selectedFile.value?.name}<br>File Size: ${formatFileSize(selectedFile.value?.size || 0)}<br>File Type: ${selectedFile.value?.type}`

	if (metadata.value) {
		if (metadata.value.width !== undefined && metadata.value.height !== undefined) {
			text += `<br>Width: ${metadata.value.width}px<br>Height: ${metadata.value.height}px`
		}
		if (metadata.value.aspectRatio !== undefined) {
			text += `<br>Aspect Ratio: ${metadata.value.aspectRatio.toFixed(2)}`
		}
		if (metadata.value.duration !== undefined) {
			text += `<br>Duration: ${formatDuration(metadata.value.duration)}`
		}
	}

	return text
}

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDuration = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const secs = Math.floor(seconds % 60)

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}
	return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// メタデータイベントハンドラー
const handleMetadataLoaded = (metadataData: {
	width?: number
	height?: number
	aspectRatio?: number
	fileSize: number
	mimeType: string
	duration?: number
}) => {
	metadata.value = metadataData
	error.value = null
}

const handleMetadataError = (errorMessage: string) => {
	error.value = errorMessage
	metadata.value = null
}

const handleMetadataLoading = (isLoading: boolean) => {
	loading.value = isLoading
}

// ファイルが変更されたときにメタデータをクリア
watch(selectedFile, () => {
	if (!selectedFile.value) {
		metadata.value = null
		error.value = null
		loading.value = false
	}
})
</script>

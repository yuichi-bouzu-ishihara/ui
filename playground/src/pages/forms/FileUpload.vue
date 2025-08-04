<template>
	<Column class="pageFormsFileUpload" gap="40">
		<Container justify="center" narrow>
			<FileUpload v-model="selectedFile" accept="image,video" />
		</Container>
		<Container>
			<Typography caption2>
				<div v-if="selectedFile">
					<div>ファイル名: {{ selectedFile.name }}</div>
					<div>サイズ: {{ formatFileSize(selectedFile.size) }}</div>
					<div>タイプ: {{ selectedFile.type }}</div>
				</div>

				<!-- 画像メタデータ表示 -->
				<div v-if="imageMetadata">
					<div>幅: {{ imageMetadata.width }}px</div>
					<div>高さ: {{ imageMetadata.height }}px</div>
					<div>アスペクト比: {{ imageMetadata.aspectRatio.toFixed(2) }}</div>
					<div>ファイルサイズ: {{ formatFileSize(imageMetadata.fileSize) }}</div>
					<div>MIMEタイプ: {{ imageMetadata.mimeType }}</div>
				</div>

				<!-- 動画メタデータ表示 -->
				<div v-if="videoMetadata">
					<div>幅: {{ videoMetadata.width }}px</div>
					<div>高さ: {{ videoMetadata.height }}px</div>
					<div>長さ: {{ formatDuration(videoMetadata.duration) }}</div>
					<div>アスペクト比: {{ videoMetadata.aspectRatio.toFixed(2) }}</div>
					<div>ファイルサイズ: {{ formatFileSize(videoMetadata.fileSize) }}</div>
					<div>MIMEタイプ: {{ videoMetadata.mimeType }}</div>
				</div>

				<Typography v-if="error" color="danger" inherit>
					<div>エラー</div>
					<div>
						{{ error }}
					</div>
				</Typography>

				<div v-if="loading" class="mb-4">
					<Typography color="text-060">
						メタデータを読み込み中...
					</Typography>
				</div>
			</Typography>
		</Container>
	</Column>
</template>

<script setup lang="ts">
const selectedFile = ref<File | null>(null)
const imageMetadata = ref<{
	width: number
	height: number
	aspectRatio: number
	fileSize: number
	mimeType: string
} | null>(null)
const videoMetadata = ref<{
	width: number
	height: number
	duration: number
	aspectRatio: number
	fileSize: number
	mimeType: string
} | null>(null)
const error = ref<string | null>(null)
const loading = ref(false)

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

watch(selectedFile, async () => {
	if (selectedFile.value) {
		loading.value = true
		error.value = null
		imageMetadata.value = null
		videoMetadata.value = null

		try {
			const { getImageMetadata, getVideoMetadata } = useFile()

			// ファイルタイプに応じてメタデータを取得
			if (selectedFile.value.type.startsWith('image/')) {
				imageMetadata.value = await getImageMetadata(selectedFile.value)
			}
			else if (selectedFile.value.type.startsWith('video/')) {
				videoMetadata.value = await getVideoMetadata(selectedFile.value)
			}
		}
		catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error'
		}
		finally {
			loading.value = false
		}
	}
})
</script>

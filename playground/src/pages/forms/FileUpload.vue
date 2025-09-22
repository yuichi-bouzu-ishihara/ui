<template>
	<Container class="pageFormsFileUpload" narrow>
		<Column gap="40">
			<FileUpload v-model="selectedFile" accept="image,video" :icon="{ name: 'upload' }"
				:max-size="5 * 1024 * 1024 * 1024" />
			<Typography caption2>
				<table v-if="selectedFile" class="mb-2">
					<tbody>
						<tr>
							<th>ファイル名</th>
							<td>{{ selectedFile.name }}</td>
						</tr>
						<tr>
							<th>サイズ</th>
							<td>{{ formatFileSize(selectedFile.size) }}</td>
						</tr>
						<tr>
							<th>タイプ</th>
							<td>{{ selectedFile.type }}</td>
						</tr>
					</tbody>

					<!-- 画像メタデータ表示 -->
					<tbody v-if="imageMetadata">
						<tr>
							<th>幅</th>
							<td>{{ imageMetadata.width }}px</td>
						</tr>
						<tr>
							<th>高さ</th>
							<td>{{ imageMetadata.height }}px</td>
						</tr>
						<tr>
							<th>アスペクト比</th>
							<td>{{ imageMetadata.aspectRatio.toFixed(2) }}</td>
						</tr>
						<tr>
							<th>ファイルサイズ</th>
							<td>{{ formatFileSize(imageMetadata.fileSize) }}</td>
						</tr>
						<tr>
							<th>MIMEタイプ</th>
							<td>{{ imageMetadata.mimeType }}</td>
						</tr>
					</tbody>

					<!-- 動画メタデータ表示 -->
					<tbody v-if="videoMetadata">
						<tr>
							<th>幅</th>
							<td>{{ videoMetadata.width }}px</td>
						</tr>
						<tr>
							<th>高さ</th>
							<td>{{ videoMetadata.height }}px</td>
						</tr>
						<tr>
							<th>長さ</th>
							<td>{{ formatDuration(videoMetadata.duration) }}</td>
						</tr>
						<tr>
							<th>アスペクト比</th>
							<td>{{ videoMetadata.aspectRatio.toFixed(2) }}</td>
						</tr>
						<tr>
							<th>ファイルサイズ</th>
							<td>{{ formatFileSize(videoMetadata.fileSize) }}</td>
						</tr>
						<tr>
							<th>MIMEタイプ</th>
							<td>{{ videoMetadata.mimeType }}</td>
						</tr>
					</tbody>
				</table>

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
		</Column>
	</Container>
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

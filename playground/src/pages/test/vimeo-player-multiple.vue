<template>
	<div class="pageTestVimeoPlayerMultiple">
		<Row split="4">
			<Ratio v-for="(item, index) in list" :key="`${item.videoId}-${index}`" wide-screen>
				<VimeoPlayer :key="`${item.videoId}-${index}-${resetCount[index]}`" v-model:muted="muted"
					v-model:volume="volume" :video-id="item.videoId" autoplay background loop :autopause="false"
					:debug="item.debug" @buffererror="onBufferError(index)" @looperror="onLoopError(index)" />
			</Ratio>
		</Row>
	</div>
</template>

<script setup lang="ts">
/**
 * 以下は honoo.tokyo で再生可能な動画の ID です。
 *
 * @note 再生して確認する場合は、nuxt.config.ts の vite 設定に下記を追記してください。
 * ```ts
 * export default defineNuxtConfig({
 *   vite: {
 *     server: {
 *       ...(process.env.NODE_ENV === 'development' ? {
 *         host: 'local.honoo.tokyo',
 *         port: 3000,
 *       } : {}),
 *     },
 *   },
 * })
 * ```
 * @note また、package.json の dev script に下記を追記してください。
 * ```json
 * "dev": "--host local.honoo.tokyo --port 3000",
 * ```
 */
const list = ref([
	{ videoId: '1134844894', debug: ['bufferstart', 'bufferend', 'progress'] },
	{ videoId: '1129930408', debug: [] },
	{ videoId: '1121382613', debug: [] },
	{ videoId: '1127783913', debug: [] },
	{ videoId: '1130748735', debug: [] },
	{ videoId: '1129893127', debug: [] },
	{ videoId: '1137491241', debug: [] },
	{ videoId: '1129555279', debug: [] },
	{ videoId: '1129878451', debug: [] },
	{ videoId: '1129886875', debug: [] },
	{ videoId: '1134844894', debug: ['bufferstart', 'bufferend', 'progress'] },
	{ videoId: '1129930408', debug: [] },
	{ videoId: '1121382613', debug: [] },
	{ videoId: '1127783913', debug: [] },
	{ videoId: '1130748735', debug: [] },
	{ videoId: '1129893127', debug: [] },
	{ videoId: '1137491241', debug: [] },
	{ videoId: '1129555279', debug: [] },
	{ videoId: '1129878451', debug: [] },
	{ videoId: '1129886875', debug: [] },
])
const muted = ref(true)
const volume = ref(0.25)
const resetCount = ref<number[]>(Array.from({ length: list.value.length }, () => 0))

// Methods --------------------------------------------------
const onBufferError = (index: number) => {
	const videoId = list.value[index].videoId
	console.log('Buffer error', videoId)
	resetCount.value[index]++
}

const onLoopError = (index: number) => {
	const videoId = list.value[index].videoId
	console.log('Loop error', videoId)
	resetCount.value[index]++
}
</script>

<template>
	<div class="pageTestVimeoPlayerMultiple">
		<Row split="4">
			<Ratio v-for="item in list" :key="item.videoId" wide-screen>
				<VimeoPlayer v-model:muted="muted" v-model:volume="volume" :video-id="item.videoId" autoplay background loop
					:autopause="false" :debug="item.debug" />
			</Ratio>
		</Row>
	</div>
</template>

<script setup lang="ts">
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
</script>

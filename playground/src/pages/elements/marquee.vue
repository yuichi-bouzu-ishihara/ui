<template>
	<Box class="pageElementsMarquee" w="100vw" pl="40" pr="40">
		<h3>Basic</h3>
		<Marquee>
			<Box v-for="i in 5" :key="i" w="120" h="60" r="8" color="light" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }">
				Item {{ i }}
			</Box>
		</Marquee>

		<h3>Reverse / Fast</h3>
		<Marquee :duration="8" :gap="24" reverse>
			<Box v-for="i in 5" :key="i" w="120" h="60" r="8" color="primary" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }">
				Item {{ i }}
			</Box>
		</Marquee>

		<h3>Pause on Hover</h3>
		<Marquee :duration="15" :gap="32" pause-on-hover>
			<Box v-for="i in 8" :key="i" w="100" h="100" r="50" color="secondary" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }">
				{{ i }}
			</Box>
		</Marquee>

		<h3>Paused (toggle)</h3>
		<button @click="isPaused = !isPaused" :style="{ alignSelf: 'flex-start', padding: '4px 12px', cursor: 'pointer' }">
			{{ isPaused ? 'Resume' : 'Pause' }}
		</button>
		<Marquee :paused="isPaused">
			<Box v-for="i in 5" :key="i" w="120" h="60" r="8" color="light" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }">
				Item {{ i }}
			</Box>
		</Marquee>

		<h3>Gradation Mask</h3>
		<Marquee :duration="12" gradation-mask>
			<Box v-for="i in 6" :key="i" w="160" h="80" r="8" color="light" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }">
				Card {{ i }}
			</Box>
		</Marquee>
	</Box>
</template>

<script setup lang="ts">
const isPaused = ref(false)
</script>

<style lang="scss">
.pageElementsMarquee {
	display: flex;
	flex-direction: column;
	gap: 32px;

	h3 {
		font-size: 14px;
		font-weight: 600;
		opacity: 0.5;
	}
}
</style>

<template>
	<div :class="`processingLayer${isOpen ? ' _open' : ''}`">
		<TransitionFade duration="50">
			<ProcessingLock v-if="isOpen" class="processingLayer-item" />
		</TransitionFade>
	</div>
</template>

<script setup lang="ts">
import { useProcessing } from '../../composables/overlays/processing'
import TransitionFade from '../transition/TransitionFade.vue'
import ProcessingLock from './ProcessingLock.vue'

// Composables ---------------------------
const { isOpen } = useProcessing()
</script>

<style lang="scss">
.processingLayer {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;

	&>&-item {
		z-index: 1;
	}
}
</style>

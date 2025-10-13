<template>
	<Container narrow class="toastLayer">
		<Box w="100%" relative>
			<TransitionGroup name="toast">
				<template v-for="(toast) in list" :key="toast.id">
					<Box h="10" />
					<Toast class="toastLayer-item" v-bind="toast" @close="hide(toast.id)" />
				</template>
			</TransitionGroup>
		</Box>
	</Container>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/overlays/toast'
import Toast from './Toast.vue'

const { list, hide } = useToast()
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
$cn: '.toastLayer';

#{$cn} {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding-bottom: calc(var(--toast-bottom, 16px) + env(safe-area-inset-bottom));
	display: flex;
	flex-direction: column;
	align-items: center;
	pointer-events: none;

	&:empty {
		display: none;
	}

	&-item {
		width: 100%;
		max-width: 100%;
	}
}

.toast-enter-active,
.toast-leave-active,
.toast-move {
	transition: var.$transition-base;
}

.toast-enter-from {
	opacity: 0;
	transform: translateY(100%);
}

.toast-leave-to {
	opacity: 0;
	transform: translateY(0);
}

.toast-leave-active {
	position: absolute;
}
</style>

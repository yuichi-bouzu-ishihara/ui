<template>
	<Box class="more" w="100%" relative>
		<template v-if="reverse">
			<Box v-if="!disabled" :key="`more-top-${startDate}`" v-intersect.in="{ rootMargin: '50% 0px 0px 0px' }" w="100%"
				@intersect="onIntersect" />
			<Box v-if="loading" w="100%" :h="loaderHeight" :pb="gap">
				<slot name="loader">
					<Center>
						<Spinner />
					</Center>
				</slot>
			</Box>
		</template>
		<slot />
		<template v-if="!reverse">
			<Box v-if="!disabled" :key="`more-bottom-${startDate}`" v-intersect.in="{ rootMargin: '0px 0px 50% 0px' }"
				w="100%" @intersect="onIntersect" />
			<Box v-if="loading" w="100%" :h="loaderHeight" :pt="gap">
				<slot name="loader">
					<Center>
						<Spinner />
					</Center>
				</slot>
			</Box>
		</template>
	</Box>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import Box from '../layout/Box.vue'
import Center from '../layout/Center.vue'
import Spinner from '../elements/Spinner.vue'

// Props ------------------
const props = defineProps({
	loading: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
	gap: { type: [Number, String], default: 0 }, // ローダー （ Observer Element ） との間隔
	reverse: { type: Boolean, default: false }, // ローダー （ Observer Element ） を上に表示するかどうか。デフォルト（false)は下。
	loaderHeight: { type: [Number, String], default: 56 }, // Observer Element の高さ
	loaderIconSize: { type: [Number, String], default: 16 },
})
const { disabled, loading } = toRefs(props)

// Data ---------------------
const startDate = ref(0)

// Emits ----------------------
const emit = defineEmits(['reached'])

// Methods ------------------
const onIntersect = () => {
	if (props.disabled) return
	emit('reached')
}

// Watchers
watch([disabled, loading], ([newDisabled, newLoading], [oldDisabled, oldLoading]) => {
	if (newDisabled === oldDisabled && newLoading === oldLoading) return
	startDate.value = Date.now()
})
</script>

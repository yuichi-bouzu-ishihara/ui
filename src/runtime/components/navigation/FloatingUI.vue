<template>
	<Box class="floatingUI" :class="{ _noPadding: noPadding }" w="100%" fixed v-bind="{ bottom }" left="0" right="0"
		z-index="1" disabled>
		<Container class="floatingUI-inner" v-bind="{ wide, full, narrow }">
			<Box relative>
				<Row justify="end">
					<slot />
				</Row>
			</Box>
		</Container>
	</Box>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNavigationTabBar } from '../../composables/navigation/tab-bar'

// Props -----------------------------------------------
const props = defineProps({
	noPadding: { type: Boolean, default: false },
	noTabBarHeight: { type: Boolean, default: false },
	wide: { type: Boolean, default: false },
	full: { type: Boolean, default: false },
	narrow: { type: Boolean, default: false },
})

// Computed -----------------------------------------------
const bottom = computed(() => {
	return props.noTabBarHeight ? 36 : useNavigationTabBar().height.value + 36
})
</script>

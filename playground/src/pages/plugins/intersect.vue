<template>
	<div class="pageColor">
		<Box w="100%" h="1000vh">
			<Column align="end" fit>
				<Box v-intersect.in="{ rootMargin: '0px 0px -200px 0px' }" h="200" w="300" color="primary"
					@intersect="isIntersect = $event.isIntersecting">
					In: {{ isIntersect }}
				</Box>
				<Box v-intersect.out="{ rootMargin: '0px 0px 50% 0px' }" h="200" w="300" color="primary"
					@intersect="isIntersect = false">
					Out: {{ isIntersect }}
				</Box>
			</Column>
		</Box>
	</div>
</template>

<script setup lang="ts">
const isIntersect = ref(false)
</script>

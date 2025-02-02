<template>
	<div class="pageTestVueDraggablePlus">
		<VueDraggable v-model="list" class="pageTestVueDraggablePlus-list" :animation="150">
			<Typography v-for="item in list" :key="item" class="pageTestVueDraggablePlus-list-item" body bold color="light">
				{{ item }}
			</Typography>
		</VueDraggable>
	</div>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'

const list = ref(['item1', 'item2', 'item3'])
</script>

<style lang="scss">
.pageTestVueDraggablePlus {
	&-list {
		display: flex;
		gap: 4px;

		&-item {
			padding: 4px 8px;
			background-color: var(--color-dark);
		}
	}
}
</style>

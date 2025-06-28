<template>
	<div class="pageOverLaysSheet">
		<Sheet name="test" :close="!isEdit" center :left-icon="isEdit ? undefined : 'edit'"
			:right-icon="isEdit ? 'checkCircleLine' : undefined" @left-icon-click="isEdit = !isEdit"
			@right-icon-click="isEdit = !isEdit" @close="handleClose">
			<template #header-center>
				<TransitionFade>
					<Typography v-if="isEdit" bold caption1 cap-height-baseline color="text-060">
						タップして編集する
					</Typography>
				</TransitionFade>
			</template>
		</Sheet>
	</div>
</template>

<script setup lang="ts">
// Data -----------------------------------------------
const isEdit = ref(false)

// Methods -----------------------------------------------
const handleClose = () => {
	console.log('close')
}
</script>

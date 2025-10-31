<template>
	<Sheet class="nest1Sheet" full center :title="currentStep.title"
		:pagenation="{ current: stepCount + 1, total: stepList.length }">
		<template #header-right>
			<Button xsmall rounded @click="close($attrs.index as number, false)">
				close
			</Button>
		</template>
		<Column v-if="currentStep" justify="center" gap="20">
			<Icon :name="currentStep.icon" size="56" color="text" />
			<Typography body bold center>
				{{ currentStep.title }}
			</Typography>
			<Typography caption2 center>
				{{ currentStep.content }}
			</Typography>
			<Container>
				<Column justify="center" gap="8">
					<Button w="100%" @click="next">
						Next
					</Button>
				</Column>
			</Container>
		</Column>
		<Box h="40" />
	</Sheet>
</template>

<script setup lang="ts">
// Composables ---------------------------
const { close } = useSheet()

// Data -----------------------------------------------
const stepCount = ref(0)
const stepList = ref([
	{
		icon: 'info',
		title: 'Step 1',
		content: 'Content 1',
	},
	{
		icon: 'exclamation',
		title: 'Step 2',
		content: 'Content 2',
	},
	{
		icon: 'check',
		title: 'Step 3',
		content: 'Content 3',
	},
])
const currentStep = computed(() => stepList.value[stepCount.value])

// Methods -----------------------------------------------
const next = () => {
	stepCount.value++
}
</script>

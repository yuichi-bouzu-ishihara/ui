<template>
	<div class="pageTransitionGroupVerticalList">
		<Container>
			<TransitionGroupVerticalList enter-from="translateX(40px)" leave-to="translateX(-80px)">
				<Box v-for="(item, index) in list" :key="item" pt="8" pb="8">
					<Row justify="between" align="center" gap="8" nowrap>
						<Typography caption1 bold cap-height-baseline>
							{{ item }}
						</Typography>
						<Row justify="between" align="center" gap="8" nowrap>
							<IconUI :icon="{ name: 'arrowUp' }" size="24" @click="moveUp(index)" />
							<IconUI :icon="{ name: 'arrowDown' }" size="24" @click="moveDown(index)" />
							<IconUI :icon="{ name: 'trashCan' }" size="24" @click="remove(index)" />
						</Row>
					</Row>
				</Box>
				<Box pt="8" pb="8" inner-center>
					<AddLineUI v-if="!processing" :color="{ background: 'text', text: 'background' }" @click="add" />
					<Spinner v-else />
				</Box>
			</TransitionGroupVerticalList>
		</Container>
	</div>
</template>

<script setup lang="ts">
// Data --------------
const list = ref<string[]>(['Text is here.'])
const processing = ref(false)

// Methods --------------
const add = async () => {
	processing.value = true
	try {
		const response = await useFetchClient().request('https://corporatebs-generator.sameerkumar.website/', {
			method: 'GET',
		})
		if (response && 'phrase' in response) {
			list.value.push(response.phrase)
		}
	}
	catch (error) {
		console.error(error)
		await useDialog().error(new CustomError(CustomErrorCode.ValidationError, '', 'データの取得に失敗しました。'))
	}
	processing.value = false
}
const remove = (index: number) => {
	list.value.splice(index, 1)
}
const moveUp = (index: number) => {
	const item = list.value[index]
	list.value.splice(index, 1)
	list.value.splice(index - 1, 0, item)
}
const moveDown = (index: number) => {
	const item = list.value[index]
	list.value.splice(index, 1)
	list.value.splice(index + 1, 0, item)
}
</script>

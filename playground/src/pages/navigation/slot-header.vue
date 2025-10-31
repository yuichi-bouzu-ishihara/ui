<template>
	<div class="pageNavigationMenu">
		<Container>
			<Column gap="40">
				<SlotHeader title="Title" :pagenation="{ current: 2, total: 5 }">
					<template #left>
						<Icon name="add" size="20" />
					</template>
					<template #right>
						<Icon name="cross" size="20" />
					</template>
				</SlotHeader>
			</Column>
		</Container>
	</div>
</template>

<script setup>
</script>

<style lang="scss"></style>

<template>
	<div class="pageElementsAvatar">
		<Column justify="center" gap="40">
			<Avatar src="https://cdn.pixabay.com/photo/2023/09/03/10/28/ai-generated-8230430_1280.png" size="100" />
			<AvatarGroup
				:list="['https://cdn.pixabay.com/photo/2023/06/13/17/16/ai-generated-8061458_1280.png', 'https://cdn.pixabay.com/photo/2023/09/03/10/28/ai-generated-8230431_1280.png', 'https://cdn.pixabay.com/photo/2024/06/23/07/55/face-8847631_1280.jpg']"
				size="120" border="2" />
			<AvatarStacks
				:list="['https://cdn.pixabay.com/photo/2023/06/13/17/16/ai-generated-8061458_1280.png', 'https://cdn.pixabay.com/photo/2023/09/03/10/28/ai-generated-8230431_1280.png', 'https://cdn.pixabay.com/photo/2024/06/23/07/55/face-8847631_1280.jpg']"
				size="40" border="2" gap="4" />
		</Column>
	</div>
</template>

<script setup>
</script>

<style lang="scss"></style>

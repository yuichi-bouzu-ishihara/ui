<template>
	<Row class="avatarStacks" justify="end" align="center" reverse nowrap>
		<Box v-for="(face, index) in list" :key="`avatarStacks-${index}`" :ml="index + 1 === list.length ? 0 : -gap"
			:h="size">
			<Avatar :src="face" v-bind="{ size, border, borderColor }" />
		</Box>
	</Row>
</template>

<script setup lang="ts">
// Props --------------------------------------------------
defineProps({
	list: {
		type: Array as unknown as () => string[],
		default: () => [],
	},
	size: { type: [Number, String], default: 40 },
	border: { type: [Number, String], default: 2 },
	gap: { type: [Number, String], default: 4 }, // マイナスギャップ
	borderColor: { type: String, default: 'background' }, // 線の色
})
</script>

<style lang="scss">
$cn: 'avatarStacks'; // コンポーネントクラス名

.#{$cn} {
	width: auto;
}
</style>

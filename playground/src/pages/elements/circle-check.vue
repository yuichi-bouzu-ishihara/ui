<template>
	<Container narrow>
		<Center>
			<Column justify="center" align="center" gap="20">
				<!-- デフォルト -->
				<CircleCheck :size="48" :stroke="3" :duration="800" />

				<!-- カラーバリエーション -->
				<CircleCheck :size="48" :stroke="3" :duration="1000" color="success" />
				<CircleCheck :size="48" :stroke="3" :duration="1000" color="primary" />
				<CircleCheck :size="48" :stroke="2" :duration="600" color="success-060" />

				<!-- サイズバリエーション -->
				<CircleCheck :size="32" :stroke="2" :duration="800" color="primary" />
				<CircleCheck :size="64" :stroke="4" :duration="1200" color="success" />

				<!-- CSS カラー指定 -->
				<CircleCheck :size="48" :stroke="3" :duration="800" color="#00c853" />
				<CircleCheck :size="48" :stroke="3" :duration="800" color="rgba(0, 200, 83, 0.6)" />

				<!-- active で制御 -->
				<Button @click="replay">リプレイ</Button>
				<CircleCheck :size="56" :stroke="3" :duration="1000" color="success" :active="isActive" @complete="onComplete" />
				<Typography v-if="completed" size="12" color="text-060">完了しました</Typography>
			</Column>
		</Center>
	</Container>
</template>

<script setup lang="ts">
// Data ------------------------------------------------
const isActive = ref(true)
const completed = ref(false)

// Methods ------------------------------------------------
const replay = () => {
	completed.value = false
	isActive.value = false
	nextTick(() => {
		isActive.value = true
	})
}

const onComplete = () => {
	completed.value = true
}
</script>

<style lang="scss"></style>

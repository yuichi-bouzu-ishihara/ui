<template>
	<div class="payloadTextarea">
		<div class="payloadTextarea-label">
			{{ label }}
		</div>
		<div class="payloadTextarea-content">
			<Textarea v-model="model" name="payload" placeholder="Payload" :autoheight="false" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, onMounted, nextTick } from 'vue'

// Models ------------------------------------------------------------
const model = defineModel<string>({ default: '' })

// Props ------------------------------------------------------------
defineProps({
	label: { type: String, default: 'Payload' },
})

// Methods ------------------------------------------------------------
// Textarea の高さを調整する関数
const adjustTextareaHeight = () => {
	const textarea = document.querySelector('textarea')
	if (textarea) {
		const lineHeight = 20 // 1行あたりの高さ（px）
		const lines = model.value.split('\n').length // 改行数を計算
		textarea.style.height = `${lines * lineHeight}px` // 高さを設定
	}
}

// Watchers ------------------------------------------------------------
// model の変更を監視して高さを調整
watch(() => model.value, () => {
	adjustTextareaHeight()
})

// Lifecycle Hooks ------------------------------------------------------------
onMounted(async () => {
	await nextTick()
	adjustTextareaHeight()
})
</script>

<style lang="scss">
.payloadTextarea {
	width: 100%;
	background-color: var(--color-text);
	border-radius: 5px;
	font-family: 'Courier New', Courier, monospace;
	font-size: 12px;
	line-height: 1.675;
	color: var(--color-background);
	box-shadow: inset 0 0 0 1000px rgba(black, 0.05);

	&-label {
		padding: 10px;
		border-bottom: .5px solid var(--color-background-020);
		font-weight: bold;
	}

	&-content {
		padding: 10px;
		font-weight: bold;

		.textarea-inner {
			font: inherit;
			color: var(--color-background);
		}

		// 横スクロールを可能にする
		textarea {
			white-space: nowrap;
			overflow-x: auto;
			box-sizing: border-box; // パディングとボーダーを含めたサイズ計算
		}
	}
}
</style>

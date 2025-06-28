<template>
	<div class="pageFormsTextareadatalist">
		<Center class="pageFormsTextareadatalist-container-inner">
			<Typography title2>
				<TextareaDatalist v-model="str" name="test" label="ラベル" placeholder="テキストを入力する..." :list="[
					'応援ありがとうございます！',
					'いつもありがとうございます！いつもありがとうございます！いつもありがとうございます！',
					'お疲れ様です！',
					'おはようございます！',
					'こんにちは！',
					'こんばんは！',
				]" />
			</Typography>
		</Center>
	</div>
</template>

<script setup lang="ts">
// Data ---------------------
const str = ref('選択内容')
</script>

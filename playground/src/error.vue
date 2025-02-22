<template>
	<div class="error">
		<Page center bottom-space="50">
			<Column justify="center" gap="12">
				<Icon name="exclamation" size="40" />
				<Typography v-if="title" title2 extrabold center>
					<!-- eslint-disable-next-line vue/no-v-html -->
					<span v-html="title" />
				</Typography>
				<Typography v-if="message" caption1 bold center>
					<!-- eslint-disable-next-line vue/no-v-html -->
					<span v-html="message" />
				</Typography>
				<Typography v-if="code" footnote center color="60">
					<!-- eslint-disable-next-line vue/no-v-html -->
					<span v-html="code" />
				</Typography>
				<Button small rounded w="200" @click="handleClick">
					clear
				</Button>
			</Column>
		</Page>
	</div>
</template>

<script setup lang="ts">
import { NuxtError, type CustomError, CustomErrorCode } from '../../src/runtime/classes/error'

// Props ------------------
const props = defineProps({
	error: { type: [NuxtError, Object] },
})

// Data ------------------
const title = ref<string>('')
const message = ref<string>('')
const code = ref<string>('')

// Methods ------------------
const handleClick = () => {
	clearError({ redirect: '/' })
}

// Lifecycle Hooks ------------------
onMounted(async () => {
	useUI().init()

	const error = props.error as CustomError
	code.value = String(error.code) || String(props.error?.statusCode)

	if (Object.keys(CustomErrorCode).includes(code.value)) {
		title.value = CustomErrorCode[code.value as keyof typeof CustomErrorCode] as string // エラーコードに対応するタイトルを設定
		message.value = error.message
	}
	else {
		title.value = 'Unknown Error'
		message.value = error.message
	}

	// エラー内容を log する
	console.error(props.error)
})
</script>

<style lang="scss">
@use '../../src/runtime/scss/_mixins.scss' as mix;
$cn: '.error'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

<template>
	<!-- eslint-disable-next-line vue/no-v-html -->
	<span v-html="formattedText" />
</template>

<script setup>
/**
 * テキストを装飾します。
 * @description a / mark / strong ,,, などで囲います。
 * @note URLリンクは常に行います。
 */

// Props --------------------------------------------------
const props = defineProps({
	text: { type: String, default: '' }, // 表示するテキスト
	marks: { type: Array, default: () => [] }, // マークするテキストの配列
	strongs: { type: Array, default: () => [] }, // 強調するテキストの配列
})

// Data --------------------------------------------------
const { text, marks, strongs } = toRefs(props)
const formattedText = ref('')

// HTMLをエスケープする関数
const escapeHtml = (string) => {
	return string.replace(/[&<>"']/g, (match) => {
		const escape = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			'\'': '&#39;',
		}
		return escape[match]
	})
}

// Lifecycle Hooks ----------------------------------------
onMounted(() => {
	// テキストをサニタイズ
	const sanitizedText = escapeHtml(text.value)

	// 現在のドメインを取得
	const currentDomain = window.location.hostname

	// URLを抽出してリンク化
	const urlRegex = /https?:\/\/\S+/g
	let intermediateText = sanitizedText.replace(urlRegex, (url) => {
		const urlDomain = new URL(url).hostname
		const target = urlDomain === currentDomain ? '_self' : '_blank'
		return `<a href="${url}" target="${target}">${url}</a>`
	})

	// マーク処理
	marks.value.forEach((textToHighlight) => {
		const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		const pattern = new RegExp(`(${escapeRegExp(textToHighlight)})`, 'gi')
		intermediateText = intermediateText.replace(pattern, '<mark>$1</mark>')
	})

	// 強調処理
	strongs.value.forEach((textToEmphasize) => {
		const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		const pattern = new RegExp(`(${escapeRegExp(textToEmphasize)})`, 'gi')
		intermediateText = intermediateText.replace(pattern, '<strong>$1</strong>')
	})

	formattedText.value = intermediateText
})
</script>

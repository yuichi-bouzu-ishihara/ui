<template>
	<div class="codeHighlighter" :class="{ [`_${color}`]: color }">
		<div v-if="title" class="codeHighlighter-ttl">
			{{ title }}
		</div>
		<pre class="codeHighlighter-pre" :class="languageClass">
			<!-- eslint-disable-next-line vue/no-v-html -->
			<code v-html="highlightedCode" />
		</pre>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
const props = defineProps({
	title: { type: String, default: '' },
	lang: { type: String, default: 'javascript' },
	code: { type: String, required: true },
	color: { type: String, default: 'dark', validator: (value: string) => ['dark', 'light'].includes(value) },
})

// Computed property to determine the language class
const languageClass = computed(() => `_${props.lang}`)

// Function to highlight code (simple example)
const highlightedCode = computed(() => {
	const str = props.code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
	return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
		let cls = 'number'
		if (match.startsWith('"')) {
			if (match.endsWith(':')) {
				cls = '_key'
			}
			else {
				cls = '_string'
			}
		}
		else if (/true|false/.test(match)) {
			cls = '_boolean'
		}
		else if (/null/.test(match)) {
			cls = '_null'
		}
		return '<span class="' + cls + '">' + match + '</span>'
	})
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.codeHighlighter'; // コンポーネントセレクタ名

#{$cn} {
	width: 100%;
	background-color: var(--color-dark);
	border-radius: 5px;
	font-family: 'Courier New', Courier, monospace;
	font-size: 12px;
	line-height: 1.675;
	color: var(--color-light);
	/* 影を広げて背景を塗る */
	box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.05);

	&._light {
		background-color: var(--color-light);
		color: var(--color-dark);
	}

	&._light &-ttl {
		border-bottom: 0.5px solid var(--color-dark-020);
	}

	&-ttl {
		padding: 10px;
		border-bottom: 0.5px solid var(--color-light-020);
		font-weight: bold;
	}

	&-pre {
		display: flex;
		margin: 0;
		padding: 10px;
		overflow-x: auto;

		code {
			display: block; // 追加: ブロック要素として表示
			margin: 0; // 追加: codeタグのマージンをリセット
			padding: 0; // 追加: codeタグのパディングをリセット
		}

		._key {
			font-weight: bold;
			color: #d73a49;
		}

		._string {
			font-weight: bold;
			color: green;
		}

		._number {
			font-weight: bold;
			color: green;
		}

		._boolean {
			font-weight: bold;
			color: #d73a49;
		}

		._null {
			font-weight: bold;
			color: #6a737d;
		}

		// 言語ごとのスタイル
		&._javascript {}

		&._json {}
	}
}
</style>

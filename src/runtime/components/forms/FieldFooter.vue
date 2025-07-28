<template>
	<div class="fieldFooter" :class="classes">
		<div class="fieldFooter-border">
			<div class="fieldFooter-border-inner" />
		</div>
		<TransitionAcordion>
			<Box v-if="message || description" w="100%">
				<Box h="8" />
				<template v-if="message">
					<Typography caption3 color="danger">
						{{ message }}
					</Typography>
				</template>
				<template v-else-if="description">
					<Typography caption3 color="text-060">
						<!-- eslint-disable-next-line vue/no-v-html -->
						<span v-html="description" />
					</Typography>
				</template>
			</Box>
		</TransitionAcordion>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Box from '../layout/Box.vue'
import Typography from '../elements/Typography.vue'

// Props -------------------------------------------
const props = defineProps({
	description: { type: String, default: '' }, // 説明文
	message: { type: String, default: '' }, // エラーなどを伝えるメッセージ
	focus: { type: Boolean, default: false }, // フォーカスをあてる
	fail: { type: Boolean, default: false }, // バリデーションに失敗したかどうか
})

// Computed -------------------------------------------
const classes = computed(() => {
	return {
		_focus: props.focus,
		_fail: props.fail,
	}
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.fieldFooter'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		&-border {
			width: 100%;
			height: .5px;
			background-color: var(--color-text-030);

			&-inner {
				width: 100%;
				height: 100%;
				background-color: var(--color-text);
				opacity: 0;
				transform-origin: center left;
				transform: scaleX(0);
				transition: var.$transition-base;
				transition-duration: var.$transition-fast-duration;
			}
		}

		&._focus &-border-inner {
			opacity: 1;
			transform: scaleX(1);
		}

		&._fail &-border {
			background-color: var(--color-danger-030);

			&-inner {
				background-color: var(--color-danger);
			}
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

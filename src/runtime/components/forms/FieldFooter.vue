<template>
	<Column class="fieldFooter" :class="classes" gap="8">
		<div class="fieldFooter-border">
			<div class="fieldFooter-border-inner" />
		</div>
		<Box v-if="message || description" w="100%">
			<template v-if="message">
				<Typography caption3 color="danger">
					{{ message }}
				</Typography>
			</template>
			<template v-else-if="description">
				<Typography caption3 color="dark60">
					<span v-html="description" />
				</Typography>
			</template>
		</Box>
	</Column>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Box from '../layout/Box.vue'
import Column from '../layout/Column.vue'
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
			background-color: var(--color-dark-030);

			&-inner {
				width: 100%;
				height: 100%;
				background-color: var(--color-dark);
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

	@if $mode =='darkmode' {
		&-border {
			background-color: var(--color-light-030);

			&-inner {
				background-color: var(--color-light);
			}
		}
	}

	@if $mode =='auto' {}
}
</style>

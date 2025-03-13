<template>
	<Clickable class="devSection" :disabled="!to" @click="handleClick">
		<Column fit gap="6">
			<Row v-if="title">
				<div class="devSection-ttl">
					{{ title }}
				</div>
			</Row>
			<div class="devSection-content">
				<slot />
			</div>
		</Column>
	</Clickable>
</template>

<script setup lang="ts">
import Clickable from '../elements/Clickable.vue'
import Column from '../layout/Column.vue'
import Row from '../layout/Row.vue'
import { navigateTo } from '#imports'

// Props
const props = defineProps({
	title: { type: String, default: '' },
	to: { type: String, default: '' }, // リンク先
})

const handleClick = () => {
	navigateTo(props.to)
}
</script>

<style lang="scss">
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.devSection'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		// width: 100%;
		background-color: var(--color-background);
		/* 影を広げて背景を塗る */
		box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		padding: 6px 8px 8px;

		&-ttl {
			display: inline-flex;
			width: auto;
			font-family: 'Courier New', Courier, monospace;
			font-weight: bold;
			font-size: 10px;
			line-height: 1.675;
			color: var(--color-text-060);
			// padding: 0px 4px;
			// background-color: var(--color-background);
			// border-radius: 4px;
			transition: all 0.2s ease-in-out;
		}

		&-content {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			padding-bottom: 8px;
			overflow-x: auto;
		}

		&:hover &-ttl {
			color: var(--color-text);
			background-color: var(--color-background-080);
		}
	}
}
</style>

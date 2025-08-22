<template>
	<nav class="dropdownMenu">
		<div v-for="(item, index) in list" :key="`dropdownMenu-item-${index}`" @click="item.click && item.click()">
			<component :is="item.to ? 'BasicLink' : 'div'" :to="item.to" class="dropdownMenu-item"
				:class="{ _disabled: item.disabled }" no-hover-style @mouseover="hoverIndex = index"
				@mouseleave="hoverIndex = null">
				<Row class="dropdownMenu-item-inner" align="start" gap="10" nowrap>
					<template v-if="item.icon">
						<Icon :name="item.icon" :color="`var(--dropdown-menu-${hoverIndex === index ? 'hover-' : ''}text-color)`"
							size="14" />
					</template>
					<Column gap="8">
						<Box mt="-3.2">
							<Typography caption2 bold nowrap caption-baseline-height unselectable
								:color="`var(--dropdown-menu-${hoverIndex === index ? 'hover-' : ''}text-color)`">
								{{ item.name }}
							</Typography>
						</Box>
						<template v-if="item.caption">
							<Typography footnote nowrap unselectable
								:color="`var(--dropdown-menu-${hoverIndex === index ? 'hover-' : ''}text-color)`">
								<!-- eslint-disable-next-line -->
								<span v-html="item.caption" />
							</Typography>
						</template>
					</Column>
				</Row>
			</component>
		</div>
		<slot />
	</nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Interfaces ---------------------------------------------------
export type DropdownMenuItemChild = {
	icon: string
	name: string
	to?: string
	disabled?: boolean
	active?: boolean
	caption?: string
	click?: () => void
}

// Props --------------------------------------------------------
defineProps({
	list: { type: Array as () => DropdownMenuItemChild[], default: () => [] },
})

// Data --------------------------------------------------------
const hoverIndex = ref<number | null>(null)
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
$cn: '.dropdownMenu'; // コンポーネントクラス名

#{$cn} {
	border-radius: #{var.$border-radius-xlarge}px;
	box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.3);
	background-color: var(--dropdown-menu-background-color);
	backdrop-filter: blur(40px);
	overflow: hidden;

	&-item {
		display: block;
		width: 100%;
		transition: var.$transition-base;
		pointer-events: auto;
		cursor: pointer;

		&-inner {
			padding-top: 16px;
			padding-right: 28px;
			padding-left: 20px;
			padding-bottom: 16px;
		}

		// 非アクティブの表示
		&._disabled {
			cursor: default;
			opacity: 0.6;
		}

		&:hover:not(._disabled) {
			background-color: var(--dropdown-menu-hover-background-color);
		}
	}
}
</style>

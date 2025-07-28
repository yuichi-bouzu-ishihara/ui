<template>
	<nav class="dropdownMenu">
		<div v-for="(item, index) in list" :key="`dropdownMenu-item-${index}`" @click="item.click && item.click()">
			<component :is="item.to ? 'BasicLink' : 'div'" :to="item.to" class="dropdownMenu-item" no-hover-style>
				<Row class="dropdownMenu-item-inner" align="start" gap="10" nowrap>
					<template v-if="item.icon">
						<Icon :name="item.icon" :color="`light${item.disabled ? '-060' : ''}`" size="14" />
					</template>
					<Column gap="8">
						<Box mt="-3.2">
							<Typography caption2 bold nowrap caption-baseline-height unselectable
								:color="`light${item.disabled ? '-060' : ''}`">
								{{ item.name }}
							</Typography>
						</Box>
						<template v-if="item.caption">
							<Typography footnote nowrap unselectable :color="`light${item.disabled ? '-060' : ''}`">
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
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
$cn: '.dropdownMenu'; // コンポーネントクラス名

#{$cn} {
	border-radius: #{var.$border-radius-xlarge}px;
	box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.3);
	background-color: var(--color-text-005);
	backdrop-filter: blur(40px);
	overflow: hidden;

	&-item {
		display: block;
		width: 100%;
		transition: var.$transition-base;
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
		}

		&:hover:not(._disabled) {
			background-color: var(--color-text-005);
		}
	}
}
</style>

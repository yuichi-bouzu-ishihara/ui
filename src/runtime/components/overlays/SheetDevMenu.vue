<template>
	<Sheet class="sheetDevMenu" title="Menu" :left-icon="hasIndex ? 'grid2' : ''" close
		@left-icon-click="handleLeftIconClick" @close="close(false)">
		<div class="sheetDevMenu-list">
			<template v-for="(item, index) in menus" :key="`global-${index}`">
				<DevMenu v-if="item.name !== 'Index'" class="devHeader-menus-inner-list-item" v-bind="item" />
			</template>
		</div>
	</Sheet>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watchEffect, computed } from 'vue'
import { useDev } from '../../composables/dev'
import { useSheet } from '../../composables/overlays/sheet'
import DevMenu from '../dev/DevMenu.vue'
import type { DevMenu as Menu } from '../dev/interfaces'
import Sheet from './Sheet.vue'

// Stores & Composables ---------------------------
const { close } = useSheet()
const route = useRoute()
const router = useRouter()
const routes = router.getRoutes()

// Data -----------------------------------------------
const menus = ref<Menu[]>([])

// Computed -------------------------------------------
const hasIndex = computed(() => {
	return menus.value.some(menu => menu.name === 'Index')
})

// Methods ------------------
const handleLeftIconClick = () => {
	router.push('/')
}

const generateMenus = () => {
	const devRoutes = routes
	const basePath = useDev().path // ベースパスを取得
	const menuTree: Menu = { name: 'Dev', children: [], open: false }

	devRoutes.forEach((route) => {
		// ベースパスで始まるルートのみを対象にする
		if (!route.path.startsWith(basePath)) return

		const parts = route.path.replace(basePath, '').split('/').filter(part => part.length > 0)
		let currentLevel = menuTree

		if (parts.length === 0) {
			// parts が空の場合、ルートディレクトリのページを追加
			currentLevel.children.push({
				name: typeof route.name === 'string'
					? route.name.charAt(0).toUpperCase() + route.name.slice(1).replace(/-/g, ' ')
					: 'Index',
				page: route.name as string,
				children: [],
				open: false,
			})
		}
		else {
			parts.forEach((part, index) => {
				if (index === parts.length - 1) {
					// 最後の部分はページ名
					currentLevel.children.push({
						name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
						page: route.name as string,
						children: [],
						open: false,
					})
				}
				else {
					// 中間の部分はサブカテゴリー
					let subCategory = currentLevel.children.find(
						child => 'children' in child && child.name.toLowerCase() === part,
					) as Menu | undefined

					if (!subCategory) {
						subCategory = {
							name: part.charAt(0).toUpperCase() + part.slice(1),
							children: [],
							open: false,
						}
						currentLevel.children.push(subCategory)
					}

					currentLevel = subCategory
				}
			})
		}
	})

	// 修正: 'page' プロパティが存在する場合も含める
	menus.value = menuTree.children.filter((child) => {
		return 'children' in child && 'open' in child
	})
}

// Watch --------------------
watchEffect(() => {
	const name = route.name
	for (const menu of menus.value) {
		for (const child of menu.children) {
			if (child.page === name) {
				menu.open = true
			}
		}
	}
})

// Lifecycle -----------------------------------------------
onMounted(() => {
	generateMenus()
})
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.sheetDevMenu'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		&-list {
			padding-left: 5px;
			padding-right: 8px;
			padding-bottom: 20px;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>

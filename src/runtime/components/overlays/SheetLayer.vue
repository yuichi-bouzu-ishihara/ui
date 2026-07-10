<template>
	<div ref="element" :class="`sheetLayer${isOpen ? ' _open' : ''}`">
		<div class="sheetLayer-inner">
			<TransitionGroup name="sheet" @after-leave="afterLeave">
				<component :is="basics[item.component]" v-for="item in list.filter(item => item.component !== '')"
					:key="`sheetLayer-inner-item-${item.index}`" v-bind="item.props" :index="item.index" />
				<slot />
			</TransitionGroup>
		</div>
		<TransitionFade>
			<Backdrop v-if="list.length" class="sheetLayer-overlay" v-bind="backdrop" />
		</TransitionFade>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useSheet } from '../../composables/overlays/sheet'
import TransitionFade from '../transition/TransitionFade.vue'
import SheetMessage from './SheetMessage.vue'
import SheetDevMenu from './SheetDevMenu.vue'
import Backdrop from './Backdrop.vue'

// Constans ----------------------------------------------
// 表示する汎用モーダルコンポーネントを定義する
const basics: Record<
	string,
	| typeof SheetMessage
	| typeof SheetDevMenu
> = {
	SheetMessage,
	SheetDevMenu,
}

// Stores & Composables ---------------------------
const { close, list, isOpen, setIsOpen } = useSheet()
const router = useRouter()

// Computed ---------------------------
const backdrop = computed(() => {
	return {
		soft: list.value.length === 1,
		medium: list.value.length === 2,
		hard: list.value.length >= 3,
	}
})

// Methods -------------------------
const afterLeave = () => {
	if (list.value.length === 0) {
		setIsOpen(false)
	}
}

// Navigation Guard -------------------------
// ページ遷移の「前」にシートを閉じる。
// beforeClose コールバック（各シートの route/router 処理）の完了を待ってから遷移を通すため、
// watch(route.path)（遷移確定後に発火）ではなく router ガードを使う。
const removeGuard = router.beforeEach(async (to, from) => {
	if (to.path !== from.path && list.value.length > 0) {
		await close('all')
	}
	// 何も return しない = 遷移を許可する
})
onBeforeUnmount(removeGuard)
</script>

<style lang="scss">
@use '../../scss/_variables.scss' as var;
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.sheetLayer'; // コンポーネントセレクタ名

#{$cn} {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	width: 100%;
	// overflow-y: scroll;

	&._open {
		height: 100vh;
	}

	&-inner {
		height: 100%;
	}

	&-overlay {
		z-index: -1;
	}

	@include mix.breakpoint('base') {
		&-inner {
			align-items: center;
			// padding-bottom: var(--header-height);
		}
	}
}

.sheet-enter-active,
.sheet-leave-active {
	transition: transform 0.25s ease;
}

.sheet-enter-from,
.sheet-leave-to {
	transform: translateY(100%);
}
</style>

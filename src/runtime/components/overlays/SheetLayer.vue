<template>
	<div ref="element" :class="`sheetLayer${isOpen ? ' _open' : ''}`">
		<div class="sheetLayer-inner">
			<TransitionGroup name="sheet" @after-leave="afterLeave">
				<template v-if="list.length">
					<template v-for="(item, index) in list">
						<template v-if="item.component !== ''">
							<component :is="basics[item.component]" :key="`sheetLayer-inner-item-${item.component}-${index}`"
								v-bind="item.props" :index="index" />
						</template>
					</template>
					<slot />
				</template>
			</TransitionGroup>
		</div>
		<TransitionFade>
			<Backdrop v-if="list.length" class="sheetLayer-overlay" v-bind="backdrop" />
		</TransitionFade>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
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
const route = useRoute()

// Data ---------------------------
const element = ref<HTMLDivElement | null>(null)

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

// Watchers -------------------------
watch(
	() => route.path,
	(newPath, oldPath) => {
		if (newPath != oldPath) {
			// ページ遷移時に閉じる
			close('all')
		}
	},
)
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

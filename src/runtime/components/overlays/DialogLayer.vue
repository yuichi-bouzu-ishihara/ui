<template>
	<div :class="`dialogLayer${open ? ' _open' : ''}`">
		<TransitionPopover y="40">
			<template v-if="open">
				<div class="dialogLayer-inner">
					<Center>
						<component :is="basics[dialogBasicComponentName]" v-if="dialogBasicComponentName !== ''"
							:class="innerClassName" />
					</Center>
				</div>
			</template>
		</TransitionPopover>
		<TransitionFade>
			<Backdrop v-if="open" soft />
		</TransitionFade>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDialog } from '../../composables/overlays/dialog'
import TransitionPopover from '../transition/TransitionPopover.vue'
import TransitionFade from '../transition/TransitionFade.vue'
import Center from '../layout/Center.vue'
import Backdrop from './Backdrop.vue'
import DialogError from './DialogError.vue'
import DialogConfirm from './DialogConfirm.vue'
import DialogAlert from './DialogAlert.vue'

// Types ------------------------
// 汎用モーダルのコンポーネント名を定義する
type DialogBasicComponentNames = 'DialogAlert' | 'DialogConfirm' | 'DialogError'

// Constants ------------------------
const innerClassName = 'dialogLayer-item'
// 表示する汎用モーダルコンポーネントを定義する
const basics = {
	DialogAlert,
	DialogConfirm,
	DialogError,
}

// Stores & Composables ---------------------------
const { type, isOpen } = useDialog()

// Computed -------------------------
// 一つでもモーダルが表示されているかどうか
const open = computed(() => isOpen.value)
// 表示する汎用モーダルのコンポーネント名
const dialogBasicComponentName = computed(() => {
	let str: DialogBasicComponentNames | '' = ''
	if (type.value === 'alert') str = 'DialogAlert'
	if (type.value === 'confirm') str = 'DialogConfirm'
	if (type.value === 'error') str = 'DialogError'
	return str
})
</script>

<style lang="scss">
@use '../../scss/_mixins.scss' as mix;
$cn: '.dialogLayer'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100%;

		&._open {
			height: 100%;
		}

		&-inner {
			width: 100%;
			height: 100vh;
			pointer-events: none;
		}

		&>&-item {
			z-index: 1;
		}
	}
}
</style>

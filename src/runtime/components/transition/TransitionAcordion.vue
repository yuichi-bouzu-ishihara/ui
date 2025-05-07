<template>
	<ClientOnly>
		<Transition name="accordion" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter"
			@before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
			<slot />
		</Transition>
	</ClientOnly>
</template>

<script setup lang="ts">
const beforeEnter = (el: Element) => {
	; (el as HTMLElement).style.height = '0'
}
const enter = (el: Element) => {
	; (el as HTMLElement).style.height = el.scrollHeight + 'px'
}
const afterEnter = (el: Element) => {
	; (el as HTMLElement).style.height = 'auto'
}
const beforeLeave = (el: Element) => {
	; (el as HTMLElement).style.height = el.scrollHeight + 'px'
}
const leave = (el: Element) => {
	; (el as HTMLElement).style.height = '0'
}
const afterLeave = (el: Element) => {
	; (el as HTMLElement).style.height = 'auto'
}
</script>

<style lang="scss">
.accordion {

	// (略)
	&-enter-active,
	&-leave-active {
		transition: height 0.4s ease-in-out, opacity 0.4s linear;
		overflow: hidden;
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
	}

	&-enter-to,
	&-leave-from {
		opacity: 1;
	}
}
</style>

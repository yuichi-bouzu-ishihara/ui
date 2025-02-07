<template>
	<mark class="mark">
		<slot />
	</mark>
</template>

<style lang="scss">
.mark {
	color: transparent;
	background-color: var(--typography-mark);
	background-image: var(--typography-mark);
	background-clip: text; //テキストでくり抜く
	-webkit-text-fill-color: transparent; //くり抜いた部分は背景を表示
	padding-bottom: .16em; // 欧文の 「g」 の下が見切れる現象の対策。
}
</style>

<template>
	<div class="center">
		<div class="center-container">
			<div class="center-container-inner">
				<slot />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
$cn: 'center'; // コンポーネントクラス名

.#{$cn} {
	display: flex;
	width: 100%;
	height: 100%;

	&-container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		&-inner {
			position: relative;
			max-width: 100%;
			margin: auto;
		}
	}
}
</style>

<template>
	<component :is="tag" class="column" :class="classes" :style="styles">
		<slot />
	</component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCss } from '../../composables/css'
import { useNumber } from '../../composables/number'

// Composables -------------------------------------
const { getSize } = useCss() // css に関する関数
const { isPureNumber } = useNumber() // 数値 に関する関数

// Props --------------------------------
const props = defineProps({
	tag: { type: String, default: 'div' },
	reverse: { type: Boolean, default: false }, // 逆順
	fit: { type: Boolean, default: false }, // 縦横を親要素に合わせる。 横は元々100%、縦を親要素の高さに合わせる。
	fitW: { type: Boolean, default: false }, // 横幅を 100% にする
	fitH: { type: Boolean, default: false }, // 高さを 100% にする
	justify: { type: String, default: 'stretch' }, // 横方向の配置
	align: { type: String, default: 'start' }, // 縦方向の配置
	gap: { type: [Number, String], default: 0 }, // アイテムの間隔。 縦横で帰る場合は、 10px 20px （横 横 の順番）のように指定する。
})

// Computed ---------------------------------
const classes = computed(() => {
	return {
		[`_justify-${props.justify}`]: true,
		[`_align-${props.align}`]: true,
		_fit: props.fit,
		_fitW: props.fitW,
		_fitH: props.fitH,
		_reverse: props.reverse,
	}
})
const styles = computed<Record<string, string | number>>(() => {
	let justify = 'flex-start'
	switch (props.justify) {
		case 'end':
			justify = 'flex-end'
			break
		case 'center':
			justify = 'center'
			break
		case 'between':
			justify = 'space-between'
			break
		case 'around':
			justify = 'space-around'
			break
		case 'evenly':
			justify = 'space-evenly'
			break
		case 'stretch':
			justify = 'stretch'
			break
	}

	let align = 'flex-start'
	switch (props.align) {
		case 'end':
			align = 'flex-end'
			break
		case 'center':
			align = 'center'
			break
		case 'between':
			align = 'space-between'
			break
		case 'baseline':
			align = 'baseline'
			break
		case 'stretch':
			align = 'stretch'
			break
	}

	let gap: string = ''
	if (isPureNumber(String(props.gap))) {
		gap = getSize(Number(props.gap))
	}
	else {
		gap = String(props.gap)
	}

	return {
		'justify-content': align, // Row とは逆になる
		'align-items': justify, // Row とは逆になる
		gap,
	}
})
</script>

<style lang="scss">
$cn: 'column'; // コンポーネントクラス名

.#{$cn} {
	display: flex;
	flex-direction: column;
	width: auto;

	&._reverse {
		flex-direction: column-reverse;
	}

	&._fit {
		width: 100%;
		height: 100%;
	}

	&._fitW {
		width: 100%;
	}

	&._fitH {
		height: 100%;
	}

	&._autoWidth {
		width: auto;
	}
}
</style>

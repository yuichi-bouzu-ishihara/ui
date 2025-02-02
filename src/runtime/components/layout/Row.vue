<template>
	<component :is="tag" class="row" :class="classes" :style="{ ...styles, ...slotStyle }">
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
	inline: { type: Boolean, default: false }, // インライン
	nowrap: { type: Boolean, default: false }, // 折り返し
	reverse: { type: Boolean, default: false }, // 逆順
	fit: { type: Boolean, default: false }, // 縦横を親要素に合わせる。 横は元々100%、縦を親要素の高さに合わせる。
	fitW: { type: Boolean, default: false }, // 横幅を 100% にする
	fitH: { type: Boolean, default: false }, // 高さを 100% にする
	justify: { type: String, default: 'start' }, // 横方向の配置
	align: { type: String, default: 'start' }, // 縦方向の配置
	gap: { type: [Number, String, Array], default: 0 }, // アイテムの間隔。 縦横で帰る場合は、 10px 20px （横 横 の順番）のように指定する。
	split: { type: [Number, String], default: 0 }, // 分割する数
})

// Computed ---------------------------------
const classes = computed(() => {
	return {
		[`_justify-${props.justify}`]: true,
		[`_align-${props.align}`]: true,
		_split: Number(props.split) > 0,
		_inline: props.inline,
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
	else if (Array.isArray(props.gap)) {
		const [y, x] = props.gap
		gap = `${getSize(Number(x))} ${getSize(Number(y))}`
	}
	else {
		gap = String(props.gap)
	}

	return {
		'flex-wrap': props.nowrap ? 'nowrap' : 'wrap',
		'justify-content': justify,
		'align-items': align,
		gap,
	}
})

const slotStyle = computed(() => {
	if (props.split) {
		let rowGap: string = ''
		if (isPureNumber(String(props.gap))) {
			rowGap = getSize(Number(props.gap) * (Number(props.split) - 1) / Number(props.split))
		}
		else if (Array.isArray(props.gap)) {
			const [_y, x] = props.gap
			rowGap = getSize(Number(x) * (Number(props.split) - 1) / Number(props.split))
		}
		else {
			rowGap = `calc(${String(props.gap)} * ${Number(props.split) - 1})`
		}
		return {
			'--flex-basis': props.split ? `calc(${100 / Number(props.split)}% - ${rowGap})` : 'auto',
		}
	}
	else {
		return {}
	}
})
</script>

<style lang="scss">
.row {
	display: flex;
	width: auto;

	&._justify-stretch {
		&>* {
			flex-grow: 1;
		}
	}

	&._reverse {
		flex-direction: row-reverse;
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

	&._inline {
		display: inline-flex;
		width: auto;
	}

	&._split>* {
		flex-basis: var(--flex-basis);
		max-width: var(--flex-basis);
		flex-grow: 1;
	}
}
</style>

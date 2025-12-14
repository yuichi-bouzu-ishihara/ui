import { computed, type Ref } from 'vue'
import type { Position } from '../../components/gesture/Draggable.vue'

export interface RangeInputProps {
	modelValue: number
	min: number | string
	max: number | string
	step: number | string
	disabled: boolean
	controls: boolean
	color: {
		handle?: string
		bar?: string
		barBackground?: string
	}
}

export interface RangeInputEmit {
	(e: 'update:modelValue', value: number): void
}

/**
 * InputRange コンポーネントの共通ロジック
 */
export function useRangeInput(
	props: RangeInputProps,
	emit: RangeInputEmit,
	handlePosition: Ref<Position>,
	dimension: Ref<number>, // 水平方向の場合は width、垂直方向の場合は height
) {
	// stepに合わせて値を丸めるヘルパー関数
	const snapToStep = (val: number): number => {
		const min = Number(String(props.min))
		const max = Number(String(props.max))
		const step = Number(String(props.step))

		// stepが0以下の場合は丸めない
		if (step <= 0) {
			return Math.min(Math.max(val, min), max)
		}

		// minからの距離をstepで割って、最も近いstepに丸める
		const stepped = Math.round((val - min) / step) * step + min

		// minとmaxの範囲内に収める
		return Math.min(Math.max(stepped, min), max)
	}

	// 値の計算と正規化
	const value = computed({
		get: () => {
			// 現在の modelValue を min と max の範囲内に収める
			const newValue = Math.min(
				Math.max(props.modelValue, Number(String(props.min))),
				Number(String(props.max)),
			)
			// もし modelValue が min 未満または max より大きい場合、更新イベントを送信する
			if (
				props.modelValue < Number(String(props.min))
				|| props.modelValue > Number(String(props.max))
			) {
				emit('update:modelValue', newValue)
			}
			// stepに合わせて丸める
			const snappedValue = snapToStep(newValue)
			if (snappedValue !== newValue) {
				emit('update:modelValue', snappedValue)
			}
			return snappedValue
		},
		set: (value: number) => {
			// stepに合わせて丸めてから更新
			const snappedValue = snapToStep(value)
			emit('update:modelValue', snappedValue)
		},
	})

	// 0 以上 1 以下の値に正規化
	const normalizedValue = computed(() => {
		const min = Number(String(props.min))
		const max = Number(String(props.max))
		return (value.value - min) / (max - min)
	})

	// 位置から値を計算（水平方向: x を使用、垂直方向: y を使用）
	const changePosition = (isVertical: boolean) => {
		const position = isVertical ? handlePosition.value.y : handlePosition.value.x
		// 垂直方向の場合、下が min、上が max になるように逆転
		const normalizedPosition = isVertical
			? 1 - position / dimension.value
			: position / dimension.value
		const min = Number(String(props.min))
		const max = Number(String(props.max))
		const range = max - min
		const rawValue = normalizedPosition * range + min

		// stepに合わせて値を丸める
		const snappedValue = snapToStep(rawValue)

		// 値を更新
		value.value = snappedValue

		// 丸められた値に対応する位置を再計算
		const normalizedSnappedValue = (snappedValue - min) / (max - min)
		const snappedPosition = isVertical
			? (1 - normalizedSnappedValue) * dimension.value
			: normalizedSnappedValue * dimension.value

		// 0 以上 dimension 以下に制限
		const clampedPosition = Math.min(Math.max(snappedPosition, 0), dimension.value)
		if (isVertical) {
			handlePosition.value.y = clampedPosition
		}
		else {
			handlePosition.value.x = clampedPosition
		}
	}

	// 値から位置を更新
	const updatePosition = (isVertical: boolean) => {
		// 垂直方向の場合、下が min、上が max になるように逆転
		const position = isVertical
			? (1 - normalizedValue.value) * dimension.value
			: normalizedValue.value * dimension.value
		if (isVertical) {
			handlePosition.value.y = position
		}
		else {
			handlePosition.value.x = position
		}
	}

	// ステップを考慮した値の増減
	const incrementValue = () => {
		const max = Number(String(props.max))
		const step = Number(String(props.step))
		const newValue = Math.min(value.value + step, max)
		value.value = snapToStep(newValue)
	}

	const decrementValue = () => {
		const min = Number(String(props.min))
		const step = Number(String(props.step))
		const newValue = Math.max(value.value - step, min)
		value.value = snapToStep(newValue)
	}

	return {
		value,
		normalizedValue,
		changePosition,
		updatePosition,
		incrementValue,
		decrementValue,
	}
}

import { describe, it, expect, vi } from 'vitest'
import { useVideoAutopause } from '../src/runtime/composables/elements/video-autopause'

/**
 * 純粋ロジックのユニットテスト。
 * VideoPlayer の autopause（他のプレイヤーが再生したら自分は停止する）を、
 * Nuxt も DOM も起動せずに検証する。
 */
describe('useVideoAutopause', () => {
	it('登録したプレイヤーは、他のプレイヤーが再生すると停止する', () => {
		// Arrange
		const { register, notifyPlay } = useVideoAutopause()
		const pause = vi.fn()
		const dispose = register(pause)

		// Act
		notifyPlay()

		// Assert
		expect(pause).toHaveBeenCalledTimes(1)
		dispose()
	})

	it('再生を開始した本人は停止しない', () => {
		// Arrange
		const { register, notifyPlay } = useVideoAutopause()
		const pause = vi.fn()
		const dispose = register(pause)

		// Act: 自分自身の停止関数を渡して再生を通知する
		notifyPlay(pause)

		// Assert
		expect(pause).not.toHaveBeenCalled()
		dispose()
	})

	it('登録した複数のプレイヤーが同時に停止する', () => {
		// Arrange
		const { register, notifyPlay } = useVideoAutopause()
		const first = vi.fn()
		const second = vi.fn()
		const disposeFirst = register(first)
		const disposeSecond = register(second)

		// Act
		notifyPlay()

		// Assert
		expect(first).toHaveBeenCalledTimes(1)
		expect(second).toHaveBeenCalledTimes(1)
		disposeFirst()
		disposeSecond()
	})

	it('再生した本人以外だけが停止する', () => {
		// Arrange
		const { register, notifyPlay } = useVideoAutopause()
		const playing = vi.fn()
		const other = vi.fn()
		const disposePlaying = register(playing)
		const disposeOther = register(other)

		// Act
		notifyPlay(playing)

		// Assert
		expect(playing).not.toHaveBeenCalled()
		expect(other).toHaveBeenCalledTimes(1)
		disposePlaying()
		disposeOther()
	})

	it('登録を解除したプレイヤーは停止しない', () => {
		// Arrange: unmount 時の解除を想定する
		const { register, notifyPlay } = useVideoAutopause()
		const pause = vi.fn()
		const dispose = register(pause)

		// Act
		dispose()
		notifyPlay()

		// Assert
		expect(pause).not.toHaveBeenCalled()
	})

	it('登録していないプレイヤーは停止しない', () => {
		// Arrange: autopause を無効にしたプレイヤーは登録しない想定。
		const { notifyPlay } = useVideoAutopause()
		const pause = vi.fn()

		// Act
		notifyPlay()

		// Assert
		expect(pause).not.toHaveBeenCalled()
	})

	it('同じ停止関数を二重に登録しても一度しか呼ばれない', () => {
		// Arrange
		const { register, notifyPlay } = useVideoAutopause()
		const pause = vi.fn()
		const disposeFirst = register(pause)
		const disposeSecond = register(pause)

		// Act
		notifyPlay()

		// Assert
		expect(pause).toHaveBeenCalledTimes(1)
		disposeFirst()
		disposeSecond()
	})

	it('別の呼び出しで得た register でも同じ登録簿を共有する', () => {
		// Arrange: コンポーネントごとに useVideoAutopause() を呼んでも
		// 互いの再生を検知できる必要がある。
		const first = useVideoAutopause()
		const second = useVideoAutopause()
		const pause = vi.fn()
		const dispose = first.register(pause)

		// Act
		second.notifyPlay()

		// Assert
		expect(pause).toHaveBeenCalledTimes(1)
		dispose()
	})
})

import { describe, it, expect, vi } from 'vitest'
import { applyPlaybackState } from '../src/runtime/composables/elements/video-playback'

/**
 * 純粋ロジックのユニットテスト。
 *
 * video 要素の autoplay は HTML の一度きりの属性で、後から false にしても
 * 再生中の動画は止まらない。表示・非表示に追従して再生を切り替えるには
 * play() / pause() を明示的に呼ぶ必要がある。その呼び分けを検証する。
 */

/** play / pause だけを持つ偽のメディア要素。 */
const createElement = (playResult: Promise<void> | undefined = Promise.resolve()) => ({
	play: vi.fn(() => playResult),
	pause: vi.fn(),
})

describe('applyPlaybackState', () => {
	it('再生を要求されたら play を呼ぶ', () => {
		// Arrange
		const element = createElement()

		// Act
		applyPlaybackState(element as unknown as HTMLMediaElement, true)

		// Assert
		expect(element.play).toHaveBeenCalledTimes(1)
		expect(element.pause).not.toHaveBeenCalled()
	})

	it('停止を要求されたら pause を呼ぶ', () => {
		// Arrange
		const element = createElement()

		// Act
		applyPlaybackState(element as unknown as HTMLMediaElement, false)

		// Assert
		expect(element.pause).toHaveBeenCalledTimes(1)
		expect(element.play).not.toHaveBeenCalled()
	})

	it('要素が未設定でも例外を投げない', () => {
		// Arrange: ref がまだ埋まっていない場面を想定する。
		// Act & Assert
		expect(() => applyPlaybackState(undefined, true)).not.toThrow()
		expect(() => applyPlaybackState(null, false)).not.toThrow()
	})

	it('自動再生がブラウザに拒否されても例外が漏れない', async () => {
		// Arrange: ミュートされていない等の理由で play() は reject しうる。
		const element = createElement(Promise.reject(new Error('NotAllowedError')))

		// Act
		applyPlaybackState(element as unknown as HTMLMediaElement, true)

		// Assert: 未処理の rejection にならないことを確かめる。
		await expect(Promise.resolve()).resolves.toBeUndefined()
		expect(element.play).toHaveBeenCalledTimes(1)
	})

	it('play が Promise を返さない環境でも壊れない', () => {
		// Arrange: 古い実装では play() の戻り値が undefined になる。
		const element = createElement(undefined)

		// Act & Assert
		expect(() => applyPlaybackState(element as unknown as HTMLMediaElement, true)).not.toThrow()
		expect(element.play).toHaveBeenCalledTimes(1)
	})
})

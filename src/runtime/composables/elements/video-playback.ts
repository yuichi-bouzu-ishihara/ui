/**
 * 動画の再生状態を要素へ反映する関数をまとめたファイル
 *
 * video 要素の autoplay は HTML の一度きりの属性で、後から false にしても
 * 再生中の動画は止まらない。スクロールに追従して再生・停止を切り替えるには
 * play() / pause() を明示的に呼ぶ必要がある。
 *
 * 他の composable と違い `#imports` へ依存しない。
 * DOM も Nuxt も要らない純ロジックに保ち、単体で検証できるようにするため。
 */

/**
 * 要素の再生状態を望む状態へ合わせる。
 *
 * @param element 対象のメディア要素。ref がまだ埋まっていない場合は何もしない
 * @param shouldPlay true なら再生、false なら一時停止
 */
export const applyPlaybackState = (
	element: HTMLMediaElement | undefined | null,
	shouldPlay: boolean,
): void => {
	if (!element) {
		return
	}

	if (!shouldPlay) {
		element.pause()
		return
	}

	// 自動再生はブラウザのポリシーで拒否されうる（ミュートされていない等）。
	// 拒否されても致命的ではないので、未処理の rejection にしないためだけに受ける。
	// 古い実装では play() が Promise を返さないため optional chaining で受ける。
	element.play()?.catch(() => undefined)
}

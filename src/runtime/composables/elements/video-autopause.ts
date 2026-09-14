/**
 * VideoPlayer の autopause に関する関数をまとめたファイル
 *
 * VimeoPlayer の autopause は Vimeo の埋め込み側が面倒を見てくれるが、
 * ネイティブの video 要素には相当する仕組みが無い。
 * 停止させたいプレイヤーをモジュールスコープの登録簿へ集め、
 * どれかが再生を始めたら自分以外を止めることで同じ体験を再現する。
 *
 * 他の composable と違い `#imports` へ依存しない。
 * DOM も Nuxt も要らない純ロジックに保ち、単体で検証できるようにするため。
 */

/** 停止を要求されたときに呼ばれる関数。 */
export type VideoPauseHandler = () => void

/**
 * autopause を有効にしたプレイヤーの停止関数。
 * コンポーネントの数だけ useVideoAutopause() が呼ばれても
 * 互いの再生を検知できるよう、登録簿はモジュールスコープで 1 つだけ持つ。
 * Set なので同じ関数を二重に登録しても一度しか呼ばれない。
 */
const handlers = new Set<VideoPauseHandler>()

export const useVideoAutopause = () => {
	/**
	 * 停止関数を登録する。
	 * 戻り値を呼ぶと登録を解除する（unmount 時に呼ぶ想定）。
	 * autopause を無効にしたプレイヤーは登録しないため停止されない。
	 */
	const register = (pause: VideoPauseHandler): (() => void) => {
		handlers.add(pause)
		return () => {
			handlers.delete(pause)
		}
	}

	/**
	 * 再生を開始したことを通知し、自分以外の登録済みプレイヤーを停止する。
	 *
	 * @param self 再生を始めたプレイヤー自身の停止関数。渡すと自分は停止しない
	 */
	const notifyPlay = (self?: VideoPauseHandler): void => {
		// 停止処理の中で登録簿が変わっても走査が壊れないよう、複製してから回す。
		for (const pause of [...handlers]) {
			if (pause === self) {
				continue
			}
			pause()
		}
	}

	return {
		register,
		notifyPlay,
	}
}

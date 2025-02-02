/**
 * ブレイクポイントの設定
 * @note "min-width: " の値を設定する。つまり、指定以上のサイズの場合に適用される。
 */
export type BreakPointConfig = {
	xxl: string
	xl: string
	l: string
	m: string
	s: string
	xs: string
	base: string // ベースとする画面サイズ。 xxl, xl, l, m, s, xs のいずれかを指定する。
}

// TreeMenu のアイテム（再帰構造）
export type TreeMenuItem = {
	label: string
	icon?: string
	to?: string
	click?: () => void
	children?: TreeMenuItem[]
	ui?: TreeMenuUI[]
	expanded?: boolean
}

// hover 時に表示されるアクションアイコン
export type TreeMenuUI = {
	icon: { name?: string, size?: number, color?: string }
	to?: string
	click?: () => void
}

// モジュール設定
export type TreeMenuConfig = {
	gap: number // アイコンとラベルの間隔 e.g. 8
	iconSize: number // アイコンボックスサイズ e.g. 20
	toggleIconName: string // 展開/折り畳みアイコン名 e.g. 'arrowDown'
	toggleIconSize: number // トグルアイコンサイズ e.g. 12
	indentSize: number // ネストごとの左パディング e.g. 28
	lineColor: string // 縦接続線の色 e.g. 'color-light-020'
	fontSize: string // ラベルフォントサイズ e.g. '14'
	childrenGap: number // 子メニュー間の上下スペース e.g. 8
}

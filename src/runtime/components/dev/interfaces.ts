/**
 * メニューのデータ型
 */
export type DevMenu = {
	name: string // 名前、表示名
	children: DevMenu[] // 子メニュー
	open: boolean // メニューを開く
	page?: string
	disabled?: boolean // メニューを無効にする
}

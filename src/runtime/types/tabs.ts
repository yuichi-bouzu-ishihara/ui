export type TabsConfig = {
	typography: string // テキストサイズ e.g. largeTitle, title, body, caption,,,
	height: string // 高さ e.g. 44px
	barRadius: string // 角丸 e.g. 4px
	barHeight: string // バーの高さ e.g. 4px
	barColor: string // バーの色 e.g. color-light, color-dark
	barBackgroundHeight: string // バーの背景の高さ e.g. 1px
	gap: string // アイテムの間隔 e.g. 16px
	itemPaddingTop: string // アイテムの上部パディング e.g. 0px
	itemPaddingBottom: string // アイテムの下部パディング e.g. 8px
	itemPaddingSide: string // アイテムの左右パディング e.g. 16px
	itemWidthAuto: boolean // アイテムの幅を自動調整するかどうか e.g. true, false
}

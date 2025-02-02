export type ButtonConfig = {
	primary: ButtonPriority
	secondary: ButtonPriority
	tertiary: ButtonPriority
	quaternary: ButtonPriority
	info: ButtonPriority
	link: ButtonPriority
	light: ButtonPriority
	dark: ButtonPriority
	minimal: ButtonPriority
	large: ButtonSize
	medium: ButtonSize
	small: ButtonSize
	xsmall: ButtonSize
}

type ButtonPriority = {
	textColor: string // テキスト色 e.g. color-light, gradation-horizontal
	backgroundColor: string // 背景色 e.g. color-light, gradation-horizontal
	backgroundBlur: string // 背景ブラー e.g. 40px
	borderWidth: string // ボーダー幅 e.g. 1px - 0 はボーダーなし
	borderColor: string // ボーダー色 e.g. color-light, color-dark
}

type ButtonSize = {
	textSize: string // テキストサイズ e.g. 14px
	paddingH: string // テキストの水平パディング e.g. 14px
	height: string
	radius: string // 角丸 e.g. 4px
}

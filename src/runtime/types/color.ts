export type ColorConfig = {
	primary: string
	dark: string
	darkblack: string
	light: string
	ultralight: string
	danger: string
	success: string
	link: string
	background: string
	text: string
	control: string // e.g. form / checked background
	indicator: string // e.g. form / border
	handle: string // e.g. form / checkbox icon, switch handle, input range handle & bar
	accent: string
	[key: string]: string | Record<string, string | Record<string, string>> // 自由な入力を許可
}

export type CustomColor = {
	background: string
	text: string
}

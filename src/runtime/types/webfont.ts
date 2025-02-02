export type WebfontConfig = {
	typeSquare: {
		id: string
		list: {
			name: string
			weight: string
			sizeAdjust: string // e.g. 152%
			ascentOverride: string // e.g. 100%
			descentOverride: string // e.g. 100%
			exLocation: string[]
			exOS: string[]
		}[]
	}
	adobeFont: {
		list: {
			projectId: string
			ja: boolean // 日本語フォントかどうか
			sizeAdjust: string // e.g. 152%
			ascentOverride: string // e.g. 100% - 日本語フォントには指定不可
			descentOverride: string // e.g. 100% - 日本語フォントには指定不可
			exLocation: string[]
			exOS: string[]
		}[]
	}
}

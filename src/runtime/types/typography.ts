export type TypographyConfig = {
	font: {
		family: FontFamily
		weight: FontWeight
	}
	largeTitle: TypeFace
	title1: TypeFace
	title2: TypeFace
	title3: TypeFace
	headline: TypeFace
	subheadline: TypeFace
	lead: TypeFace
	body: TypeFace
	caption1: TypeFace
	caption2: TypeFace
	caption3: TypeFace
	callout: TypeFace
	footnote: TypeFace
	mark: string // color-primary, gradation-horizontal など
}

export type FontFamily = {
	base: string
	serif: string
	en: string
	normal: string // 通常ウェイトのファミリー
	bold: string // 太字ウェイトのファミリー
	extrabold: string // 超太字ウェイトのファミリー
}

export type FontWeight = {
	normal: number
	bold: number
	extrabold: number
}

export type TypeFace = {
	fontFamily: string
	fontSize: string
	fontWeight: string
	lineHeight: string
	capHeightBaselineTop: string // e.g. 0.24em - margin-top
	capHeightBaselineBottom: string // e.g. 0.3em - margin-bottom
}

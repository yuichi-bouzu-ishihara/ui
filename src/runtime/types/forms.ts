export type FormsConfig = {
	checkbox: {
		rectSize: string
		backgroundColor: string
		iconColor: string
		border: {
			width: string
			color: string
			radius: string
		}
		checked: {
			backgroundColor: string
			iconColor: string
			border: {
				width: string
				color: string
				radius: string
			}
		}
		hover: {
			backgroundColor: string
			iconColor: string
			border: {
				width: string
				color: string
				radius: string
			}
		}
		focus: {
			backgroundColor: string
			iconColor: string
			border: {
				width: string
				color: string
				radius: string
			}
		}
		invalid: {
			backgroundColor: string
			iconColor: string
			border: {
				width: string
				color: string
				radius: string
			}
		}
		iconSvgSrc: string // svg 画像パス e.g. url(/assets/icons/checkbox.svg)
	}
	switch: {
		backgroundColor: string
		handleColor: string
		checked: {
			backgroundColor: string
		}
	}
}

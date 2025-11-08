// Font
const adobeFontProjectId = ''
const typeSquareId = ''
const fontJA = 'Hiragino Sans'
const fontFamily = `${fontJA}, sans-serif`
const fontFamilyEN = `Helvetica Neue, ${fontJA}, sans-serif`
const fontSerif = ''
const fontWeightNormal = 400
const fontWeightBold = 700
const ascentOverride = 'normal'
const descentOverride = 'normal'

// Color
const primary = '#0C8CE9'
const dark = '#2D2E31'
const darkblack = dark
const light = '#FFFFFF'
const ultralight = light
const danger = '#E90C41'
const success = '#0C8CE9'
const link = '#277BDB' // リンク色
const background = dark // 背景色
const text = light // テキスト色
const control = success // コントロール色。 e.g. checkbox background, switch UI background...
const indicator = light // インジケーター色。 e.g. checkbox check Icon, switch UI handle...
const handle = light // ハンドル色。 e.g. checkbox icon, switch handle, input range handle & bar...
const accent = '#7FB74D'

export const defaultOptions = {
	themeColor: 'default',
	dev: {
		path: '/dev',
	},
	routeTracker: {
		disabled: true,
	},
	logo: {
		src: '',
		alt: '',
		width: 0,
		height: 0,
	},
	breakPoint: {
		// ※ scss/_variables.scss と合わせる。
		xxl: '1680px',
		xl: '1280px',
		l: '1024px',
		m: '680px',
		s: '430px',
		xs: '0px',
		base: 'm',
	},
	color: {
		primary,
		dark,
		darkblack,
		light,
		ultralight,
		danger,
		success,
		link,
		background, // 背景色 白
		text, // テキスト色 黒
		control,
		indicator,
		handle,
		accent,
	},
	gradation: {
		// ※ scss/_variables.scss と合わせる。
		special: 'linear-gradient(221.59deg, #ffc000 9.16%, #ff4900 45.33%, #ff071f 76.02%, #db0000 100%)',
		vertical: 'linear-gradient(180deg, #ff6200 0%, #ff071f 100%)',
		horizontal: 'linear-gradient(90deg, #ff071f 0%, #ff6200 100%)',
	},
	icon: {
		dir: '/assets/icons', // /public からのパスで指定する。
	},
	button: {
		primary: {
			textColor: 'color-light',
			backgroundColor: 'gradation-horizontal',
			borderWidth: '0',
			borderColor: 'transparent',
		},
		secondary: {
			textColor: 'color-dark',
			backgroundColor: 'color-light',
			borderWidth: '0',
			borderColor: 'transparent',
		},
		tertiary: {
			textColor: 'color-text',
			backgroundColor: 'color-text-010',
			borderWidth: '0',
			borderColor: 'transparent',
		},
		quaternary: {
			textColor: 'color-text',
			backgroundColor: '',
			borderWidth: '2px',
			borderColor: 'color-text',
		},
		info: {
			textColor: 'gradation-horizontal',
			backgroundColor: '',
			borderWidth: '0',
			borderColor: 'transparent',
		},
		link: {
			textColor: 'color-text',
			backgroundColor: '',
			borderWidth: '0',
			borderColor: 'transparent',
		},
		light: {
			textColor: 'color-dark',
			backgroundColor: 'color-light',
			borderWidth: '0',
			borderColor: 'transparent',
		},
		dark: {
			textColor: 'color-light',
			backgroundColor: 'color-dark',
			borderWidth: '0',
			borderColor: 'transparent',
		},
		minimal: {
			textColor: 'color-text-060',
			backgroundColor: '',
			borderWidth: '0',
			borderColor: 'transparent',
		},
		large: {
			textSize: '15px',
			height: '48px',
			paddingH: '14.5px',
			radius: '3px',
		},
		medium: {
			textSize: '13px',
			height: '44px',
			paddingH: '10.75px',
			radius: '3px',
		},
		small: {
			textSize: '12px',
			height: '36px',
			paddingH: '9.25px',
			radius: '3px',
		},
		xsmall: {
			textSize: '11px',
			height: '32px',
			paddingH: '7.5px',
			radius: '3px',
		},
	},
	webfont: {
		adobeFont: {
			list: [
				{
					projectId: adobeFontProjectId,
					ja: true,
					sizeAdjust: '100%',
					ascentOverride,
					descentOverride,
					exLocation: [''],
					exOS: [''],
				},
			],
		},
		typeSquare: {
			id: typeSquareId,
			list: [
				{
					name: '',
					weight: '',
					sizeAdjust: '',
					ascentOverride: '',
					descentOverride: '',
					exLocation: [''],
					exOS: [''],
				},
			],
		},
	},
	typography: {
		font: {
			family: {
				base: fontFamily,
				serif: fontSerif,
				en: fontFamilyEN,
				normal: fontFamily,
				bold: fontFamily,
				extrabold: fontFamily,
			},
			weight: {
				extrabold: `${fontWeightBold}`,
				bold: `${fontWeightBold}`,
				normal: `${fontWeightNormal}`,
			},
		},
		largeTitle: {
			fontFamily: fontFamily,
			fontSize: '40px',
			fontWeight: `${fontWeightBold}`,
			lineHeight: 'calc(55 / 40)',
			capHeightBaselineTop: '-0.26em',
			capHeightBaselineBottom: '-0.16em',
		},
		title1: {
			fontFamily: fontFamily,
			fontSize: '32px',
			fontWeight: `${fontWeightBold}`,
			lineHeight: 'calc(40 / 32)',
			capHeightBaselineTop: '-0.22em',
			capHeightBaselineBottom: '-0.12em',
		},
		title2: {
			fontFamily: fontFamily,
			fontSize: '24px',
			fontWeight: `${fontWeightBold}`,
			lineHeight: 'calc(33 / 24)',
			capHeightBaselineTop: '-0.26em',
			capHeightBaselineBottom: '-0.2em',
		},
		title3: {
			fontFamily: fontFamily,
			fontSize: '20px',
			fontWeight: `${fontWeightBold}`,
			lineHeight: 'calc(27.5 / 20)',
			capHeightBaselineTop: '-0.26em',
			capHeightBaselineBottom: '-0.2em',
		},
		headline: {
			fontFamily: fontFamily,
			fontSize: '16px',
			fontWeight: `${fontWeightBold}`,
			lineHeight: 'calc(26.8 / 16)',
			capHeightBaselineTop: '-0.38em',
			capHeightBaselineBottom: '-0.36em',
		},
		subheadline: {
			fontFamily: fontFamily,
			fontSize: '15px',
			fontWeight: `${fontWeightBold}`,
			lineHeight: 'calc(23.5 / 15)',
			capHeightBaselineTop: '-0.36em',
			capHeightBaselineBottom: '-0.26em',
		},
		lead: {
			fontFamily: fontFamily,
			fontSize: '16px',
			fontWeight: `${fontWeightNormal}`,
			lineHeight: 'calc(24 / 16)',
			capHeightBaselineTop: '-0.36em',
			capHeightBaselineBottom: '-0.25em',
		},
		body: {
			fontFamily: fontFamily,
			fontSize: '14px',
			fontWeight: `${fontWeightNormal}`,
			lineHeight: 'calc(23.5 / 14)',
			capHeightBaselineTop: '-0.4em',
			capHeightBaselineBottom: '-0.4em',
		},
		caption1: {
			fontFamily: fontFamily,
			fontSize: '13px',
			fontWeight: `${fontWeightNormal}`,
			lineHeight: 'calc(21.8 / 13)',
			capHeightBaselineTop: '-0.36em',
			capHeightBaselineBottom: '-0.32em',
		},
		caption2: {
			fontFamily: fontFamily,
			fontSize: '12px',
			fontWeight: `${fontWeightNormal}`,
			lineHeight: 'calc(18.5 / 12)',
			capHeightBaselineTop: '-0.25em',
			capHeightBaselineBottom: '-0.26em',
		},
		caption3: {
			fontFamily: fontFamily,
			fontSize: '11px',
			fontWeight: `${fontWeightNormal}`,
			lineHeight: 'calc(16 / 11)',
			capHeightBaselineTop: '-0.25em',
			capHeightBaselineBottom: '-0.22em',
		},
		callout: {
			fontFamily: fontFamily,
			fontSize: '11px',
			fontWeight: `${fontWeightNormal}`,
			lineHeight: 'calc(15.1 / 11)',
			capHeightBaselineTop: '-0.2em',
			capHeightBaselineBottom: '-0.24em',
		},
		footnote: {
			fontFamily: fontFamily,
			fontSize: '10px',
			fontWeight: `${fontWeightNormal}`,
			lineHeight: 'calc(13.8 / 10)',
			capHeightBaselineTop: '-0.2em',
			capHeightBaselineBottom: '-0.24em',
		},
		mark: 'gradation-horizontal', // マークの色
	},
	header: {
		height: '72px',
	},
	skeletonShape: {
		color: 'color-light-005',
		animationTo: 'color-light-003',
		delay: '150ms',
		duration: '1500ms',
		avatarSvgSrc: '',
	},
	spinner: {
		color: 'color-light',
		stroke: 6,
		size: 24,
	},
	roundProgressBar: {
		color: 'color-light',
	},
	tabs: {
		typography: 'body', // テキストサイズ e.g. largeTitle, title, body, caption,,,
		height: '28px', // 高さ e.g. 44px
		barRadius: '0', // 角丸 e.g. 4px
		barHeight: '1.5px', // バーの高さ e.g. 4px
		barColor: 'color-text', // バーの色 e.g. color-light, color-dark
		barBackgroundHeight: '0.5px', // バーの背景の高さ e.g. 44px
		barBackgroundColor: 'color-text-020', // バーの背景色 e.g. color-light, color-dark
	},
	container: {
		base: '560px', // 幅未設定時。iPhone Max に合わせる。
		wide: '1080px', // 幅広設定。ヘッダーの左右UIを考慮して、120pxずつ余裕を持
		narrow: `${360 + 16 * 2}px`, // 幅狭い設定時。 Android の小さい幅、iPhone SE に合わせる。
		minSideSpace: '16px',
	},
	sheet: {
		color: {
			background: 'color-background',
			text: 'color-text',
		},
	},
	toast: {
		color: {
			background: 'color-dark-090',
			text: 'color-light',
		},
		defaultDuration: 10000,
		bottom: '16px',
	},
	storage: {
		prefix: 'ui-',
	},
	forms: {
		checkbox: {
			rectSize: '16px',
			backgroundColor: 'color-text-000',
			iconColor: 'color-text',
			border: {
				width: '0.5px',
				color: 'color-text-030',
				radius: '2px',
			},
			checked: {
				backgroundColor: 'color-success',
				iconColor: 'color-light',
				border: {
					width: '0',
					color: 'color-success',
				},
			},
			hover: {
				backgroundColor: 'color-text-000',
				iconColor: 'color-text',
				border: {
					width: '2px',
					color: 'color-text-030',
				},
			},
			focus: {
				backgroundColor: 'color-text-000',
				iconColor: 'color-text',
				border: {
					width: '2px',
					color: 'color-text-030',
				},
			},
			invalid: {
				backgroundColor: 'color-danger',
				iconColor: 'color-light',
				border: {
					color: 'color-danger',
				},
			},
			iconSvgSrc: 'url(/assets/icons/check.svg)',
		},
		switch: {
			backgroundColor: 'color-text-020',
			handleColor: 'color-light',
			checked: {
				backgroundColor: 'color-success',
			},
		},
		range: {
			handleColor: 'color-primary',
			handleSize: '16px',
			barColor: 'color-primary',
			barBackgroundColor: 'color-text-010',
			barHeight: '4px',
		},
		radioPanel: {
			backgroundColor: 'color-text-005',
			textColor: 'color-text',
			checked: {
				backgroundColor: 'color-text',
				textColor: 'color-background',
			},
			large: {
				textSize: '15px',
				height: '48px',
				paddingH: '14.5px',
				radius: '3px',
				textAdjustTop: '-6.8px',
			},
			medium: {
				textSize: '13px',
				height: '44px',
				paddingH: '10.75px',
				radius: '3px',
				textAdjustTop: '-6px',
			},
			small: {
				textSize: '12px',
				height: '36px',
				paddingH: '9.25px',
				radius: '3px',
				textAdjustTop: '-4.8px',
			},
			xsmall: {
				textSize: '11px',
				height: '32px',
				paddingH: '7.5px',
				radius: '3px',
				textAdjustTop: '-2.8px',
			},
		},
	},
	dropdownMenu: {
		backgroundColor: 'color-dark-090',
		textColor: 'color-light',
		hover: {
			backgroundColor: 'color-light-005',
			textColor: 'color-light',
		},
	},
	toolTip: {
		backgroundColor: 'color-dark-090',
		textColor: 'color-light',
	},
	video: {
		defaultVolume: 0.2,
	},
}

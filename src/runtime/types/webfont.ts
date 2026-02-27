export type WebfontConfig = {
	typeSquare: {
		id: string
		/**
		 * フォント読み込みモード
		 * - 'auto': TypeSquare標準の自動読み込み（ページ内の文字を検出してロード）。初期表示の崩れを防ぐ。
		 * - 'preload': 従来の一括読み込み（JIS第1水準漢字すべてをロード）
		 * @default 'auto'
		 */
		loadMode?: 'auto' | 'preload'
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

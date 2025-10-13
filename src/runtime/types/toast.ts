export type ToastConfig = {
	color: {
		background: string // 背景色
		text: string // 文字色
	}
	defaultDuration?: number // デフォルトの表示時間（ミリ秒）
	bottom?: string // 下からの位置（px）
}

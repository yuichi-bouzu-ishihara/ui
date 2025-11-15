declare global {
	// 各型をグローバルに宣言
	type DevConfig = import('./dev').DevConfig
	type ModeConfig = import('./mode').ModeConfig
	type RouteTrackerConfig = import('./route-tracker').RouteTrackerConfig
	type BreakPointConfig = import('./break-point').BreakPointConfig
	type ColorConfig = import('./color').ColorConfig
	type CustomColor = import('./color').CustomColor
	type GradationConfig = import('./gradation').GradationConfig
	type TypographyConfig = import('./typography').TypographyConfig
	type IconConfig = import('./icon').IconConfig
	type ButtonConfig = import('./button').ButtonConfig
	type ButtonPriority = import('./button').ButtonPriority
	type ButtonSize = import('./button').ButtonSize
	type SkeletonShapeConfig = import('./skeleton-shape').SkeletonShapeConfig
	type SpinnerConfig = import('./spinner').SpinnerConfig
	type RoundProgressBarConfig = import('./round-progress-bar').RoundProgressBarConfig
	type WebfontConfig = import('./webfont').WebfontConfig
	type ContainerConfig = import('./container').ContainerConfig
	type AvatarConfig = import('./avatar').AvatarConfig
	type LogoConfig = import('./logo').LogoConfig
	type TabsConfig = import('./tabs').TabsConfig
	type SheetConfig = import('./sheet').SheetConfig
	type ToastConfig = import('./toast').ToastConfig
	type StorageConfig = import('./storage').StorageConfig
	type FormsConfig = import('./forms').FormsConfig
	type DropdownMenuConfig = import('./dropdown-menu').DropdownMenuConfig
	type ToolTipConfig = import('./tool-tip').ToolTipConfig
	type HeaderConfig = import('./header').HeaderConfig
	type VideoConfig = import('./video').VideoConfig
	type UIConfig = import('./index').UIConfig
	type ReadyEvent = import('./vimeo-player').ReadyEvent
	type TimeUpdateEvent = import('./vimeo-player').TimeUpdateEvent
	type VolumeChangeEvent = import('./vimeo-player').VolumeChangeEvent
	type VimeoPlayerInstance = import('./vimeo-player').VimeoPlayerInstance
}

// グローバルスコープに型をエクスポートするために空のエクスポートを追加
export { }

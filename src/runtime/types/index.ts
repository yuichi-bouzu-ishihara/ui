import type { DevConfig } from './dev'
import type { ModeConfig } from './mode'
import type { RouteTrackerConfig } from './route-tracker'
import type { BreakPointConfig } from './break-point'
import type { ColorConfig } from './color'
import type { GradationConfig } from './gradation'
import type { TypographyConfig } from './typography'
import type { IconConfig } from './icon'
import type { ButtonConfig } from './button'
import type { SkeletonShapeConfig } from './skeleton-shape'
import type { SpinnerConfig } from './spinner'
import type { RoundProgressBarConfig } from './round-progress-bar'
import type { CircleCheckConfig } from './circle-check'
import type { WebfontConfig } from './webfont'
import type { ContainerConfig } from './container'
import type { AvatarConfig } from './avatar'
import type { LogoConfig } from './logo'
import type { TabsConfig } from './tabs'
import type { SheetConfig } from './sheet'
import type { ToastConfig } from './toast'
import type { StorageConfig } from './storage'
import type { FormsConfig } from './forms'
import type { DropdownMenuConfig } from './dropdown-menu'
import type { ToolTipConfig } from './tool-tip'
import type { HeaderConfig } from './header'
import type { VideoConfig } from './video'

// VimeoPlayer types
export type { ReadyEvent, TimeUpdateEvent, VolumeChangeEvent, VimeoPlayerInstance } from './vimeo-player'

// AppConfigの型定義
export type UIConfig = {
	themeColor: 'light' | 'default'
	dev?: DevConfig
	mode?: ModeConfig
	routeTracker?: RouteTrackerConfig
	breakPoint?: BreakPointConfig
	color?: ColorConfig
	gradation?: GradationConfig
	typography?: TypographyConfig
	icon?: IconConfig
	button?: ButtonConfig
	skeletonShape?: SkeletonShapeConfig
	spinner?: SpinnerConfig
	roundProgressBar?: RoundProgressBarConfig
	circleCheck?: CircleCheckConfig
	webfont?: WebfontConfig
	container?: ContainerConfig
	sheet?: SheetConfig
	toast?: ToastConfig
	storage?: StorageConfig
	avatar?: AvatarConfig
	logo?: LogoConfig
	tabs?: TabsConfig
	forms?: FormsConfig
	dropdownMenu?: DropdownMenuConfig
	toolTip?: ToolTipConfig
	header?: HeaderConfig
	video?: VideoConfig
}

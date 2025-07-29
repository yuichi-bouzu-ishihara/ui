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
import type { WebfontConfig } from './webfont'
import type { ContainerConfig } from './container'
import type { AvatarConfig } from './avatar'
import type { LogoConfig } from './logo'
import type { TabsConfig } from './tabs'
import type { SheetConfig } from './sheet'
import type { StorageConfig } from './storage'
import type { FormsConfig } from './forms'
import type { DropdownMenuConfig } from './dropdown-menu'

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
	webfont?: WebfontConfig
	container?: ContainerConfig
	sheet?: SheetConfig
	storage?: StorageConfig
	avatar?: AvatarConfig
	logo?: LogoConfig
	tabs?: TabsConfig
	forms?: FormsConfig
	dropdownMenu?: DropdownMenuConfig
}

import type { DevConfig } from './dev'
import type { ModeConfig } from './mode'
import type { BreakPointConfig } from './break-point'
import type { ColorConfig } from './color'
import type { GradationConfig } from './gradation'
import type { TypographyConfig } from './typography'
import type { IconConfig } from './icon'
import type { ButtonConfig } from './button'
import type { SkeletonShapeConfig } from './skeleton-shape'
import type { SpinnerConfig } from './spinner'
import type { RoundProgressBarConfig } from './round-progress-bar'
import type { TabsConfig } from './tabs'
import type { WebfontConfig } from './webfont'
import type { ContainerConfig } from './container'

// AppConfigの型定義
export type UIConfig = {
	themeColor: 'light' | 'default'
	dev?: DevConfig
	mode?: ModeConfig
	breakPoint?: BreakPointConfig
	color?: ColorConfig
	gradation?: GradationConfig
	typography?: TypographyConfig
	icon?: IconConfig
	button?: ButtonConfig
	skeletonShape?: SkeletonShapeConfig
	spinner?: SpinnerConfig
	roundProgressBar?: RoundProgressBarConfig
	tabs?: TabsConfig
	webfont?: WebfontConfig
	container?: ContainerConfig
}

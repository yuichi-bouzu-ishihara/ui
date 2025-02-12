// import { useRouteTracker } from './route-tracker'
import { useScroll } from './scroll'
import { useViewport } from './viewport'
import { useEnvironment } from './environment'
import { useWebFont } from './webfont'
import { useMode } from './mode'
import { useBreakPoint } from './break-point'
import { useColor } from './color'
import { useGradation } from './gradation'
import { useTypography } from './elements/typography'
import { useIcon } from './elements/icon'
import { useButton } from './elements/button'
import { useSkeletonShape } from './elements/skeleton-shape'
import { useSpinner } from './elements/spinner'
import { useRoundProgressBar } from './elements/round-progress-bar'
import { useTabs } from './navigation/tabs'
import { useContainer } from './layout/container'
import { useLogo } from './elements/logo'
import { useDev } from './dev'
import { useAppConfig } from '#imports'

export const useUI = () => {
	return {
		init,
		dataKey: 'ui', // データ名 <style data-ui="{name}"> として使われる。
	}
}

/**
 * UI の初期化
 * @note mounted 後に実行する。
 */
const init = () => {
	const config = useAppConfig().ui
	if (!config || typeof config !== 'object') {
		throw new Error('Invalid UI Settings')
	}

	// useRouteTracker().init()
	useScroll().init()
	useViewport().init()
	useEnvironment().init()
	useWebFont().init()
	useMode().init()
	useBreakPoint().init()
	useColor().init()
	useGradation().init()
	useTypography().init()
	useIcon().init()
	useButton().init()
	useSkeletonShape().init()
	useSpinner().init()
	useRoundProgressBar().init()
	useTabs().init()
	useContainer().init()
	useLogo().init()
	useDev().init()
}

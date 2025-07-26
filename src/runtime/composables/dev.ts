/**
 * @brief devページ用のコンポーザブルズ
 * @description devページへ遷移するための特殊な操作を監視します。
 * Touchデバイスは3本指でロングタップ、それ以外は Ctrl + Shift + Alt + Enter で遷移します。
 * @version 0.0.1
 */

import type { UIConfig } from '../types'
import type { DevConfig } from '../types/dev'
import { useProcessing } from './overlays/processing'
import { useEnvironment } from './environment'
import { useUtils } from './utils'
import { useAppConfig, useRoute, useRouter, useState, readonly } from '#imports'

// Constants ------------------------
const TOUCH_TIME = 2000 // DEVページ遷移起動までのロングタップ時間
const NAVIGATION_DISPLAY_DELAY = 1500 // ナビゲーション表示までの遅延時間
const PAGE_TRANSITION_CANCEL_DELAY = 1000 // ページ遷移後のキャンセル時間

export const useDev = () => {
	const initFlag = useState<boolean>('ui-dev-initFlag', () => false) // 初期化済みフラグ
	const headerHeight = useState<number>('ui-dev-headerHeight', () => 0) // ヘッダーの高さ
	const config = useState<DevConfig | null>('ui-dev-config', () => null)
	/**
	 * 開発ページへの遷移を行う
	 */
	const init = async () => {
		// 既に初期化済みであれば何もしない
		if (initFlag.value) return
		initFlag.value = true

		const appConfig = useAppConfig().ui as unknown as UIConfig ?? {}
		// 設定がない場合は何もしない
		if (!appConfig.dev) return

		config.value = appConfig.dev
		const newPath = config.value.path

		let isNavigating = false
		const navigate = async () => {
			if (useRoute().path.includes(newPath)) return
			isNavigating = true
			await useUtils().wait(NAVIGATION_DISPLAY_DELAY)
			useProcessing().open({ message: 'Navigate To DEV', spinner: true })
			await useUtils().wait(TOUCH_TIME)
			await useRouter().push(newPath)
			await useUtils().wait(1000)
			useProcessing().close()
			await useUtils().wait(PAGE_TRANSITION_CANCEL_DELAY)
			isNavigating = false
		}

		const updateEventListeners = () => {
			document.removeEventListener('touchstart', handleTouchStart)
			document.removeEventListener('keydown', handleKeyDown)
			if (useEnvironment().touchDevice.value) {
				document.addEventListener('touchstart', handleTouchStart)
			}
			else {
				document.addEventListener('keydown', handleKeyDown)
			}
		}

		const handleTouchStart = async (event: TouchEvent) => {
			if (event.touches.length === 3) {
				if (!isNavigating) {
					await navigate()
				}
			}
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.shiftKey && event.altKey && (event.key === 'Enter' || event.code === 'Enter')) {
				if (!isNavigating) {
					navigate()
				}
			}
		}

		updateEventListeners()

		document.addEventListener('touchDeviceChanged', updateEventListeners)
	}

	return {
		init,
		initFlag: readonly(initFlag),
		headerHeight: readonly(headerHeight),
		path: config.value ? readonly(config.value).path : '',
	}
}

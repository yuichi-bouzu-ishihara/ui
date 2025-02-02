/**
 * Mode に関する関数をまとめたファイル
 * @note darkmode: boolean, sizeType: 'px' | 'auto' を管理する。
 */

import { ref } from 'vue'
import type { UIConfig } from '../types'
import { useAppConfig } from '#imports'

// 定数
const NUXT_ROOT_ID = '__nuxt'

// Data
const darkmode = ref(false)
const sizeType = ref<'px' | 'auto'>('px')

export const useMode = () => {
	return {
		darkmode,
		sizeType,
		init,
		setDarkmode,
		setSizeType,
	}
}

/**
 * 初期化
 */
const init = () => {
	if (!document) return
	if (!document.body) return
	if (!document.getElementById(NUXT_ROOT_ID)) return

	const config = useAppConfig().ui as UIConfig ?? {}
	setDarkmode(config.mode?.darkmode ?? false)
	setSizeType(config.mode?.sizeType ?? 'px')
}

/**
 * ダークモードを設定する
 * @param {boolean} value - 新しいabsoluteの値
 */
const setDarkmode = (value: boolean) => {
	darkmode.value = value

	if (!document || !document.body) return
	document.getElementById(NUXT_ROOT_ID)?.classList.toggle('_darkmode', value)
}

/**
 * サイズタイプを設定する
 * @param {boolean} value - 新しいabsoluteの値
 */
const setSizeType = (value: 'px' | 'auto') => {
	sizeType.value = value

	if (!document || !document.body) return
	document.getElementById(NUXT_ROOT_ID)?.classList.toggle('_auto', value === 'auto')
}

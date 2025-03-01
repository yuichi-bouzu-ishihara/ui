/**
 * Drawer - 引き出し
 */

import { ref } from 'vue'

// Types ---------------------
interface Payload {
	name: string // コンポーネント名
	from?: 'left' | 'right' // Drawer を開く方向（leftは左から、rightは右から引き出す）
	options?: { [key: string]: unknown } | null // オプション
}
interface Drawer extends Payload {
	date: number // 開いた日時
}

// Data ---------------------
const isOpen = ref(false) // Drawer が開かれているかどうか
const resolve = ref<((value: unknown) => void) | null>(null) // Drawer の結果を保持する
const lefts = ref<Drawer[]>([]) // 左から引き出された Drawer のコンポーネント名を保持する
const rights = ref<Drawer[]>([]) // 右から引き出された Drawer のコンポーネント名を保持する

// Drawer を操作する関数を返す
export const useDrawer = () => {
	return {
		open,
		get,
		close,
		closeOne,
		closeAll,
		isOpen,
		lefts,
		rights,
	}
}

/**
 * 指定したDrawer を表示する
 * @param {Payload} pl - ペイロード
 * @returns {Promise<false>} Drawer の結果
 */
const open = ({ name, from = 'right', options = null }: Payload): Promise<false> => {
	isOpen.value = true
	const drawer = { name, from, options, date: Date.now() }
	if (from === 'left') {
		lefts.value.push(drawer)
	}
	else {
		rights.value.push(drawer)
	}
	return new Promise((rsv) => {
		resolve.value = rsv as (value: unknown) => void
	})
}

/**
 * 指定した名前の Drawer を返す
 * @param {string} name - 閉じる Drawer の名前
 * @returns {Drawer | undefined} Drawer のオブジェクト
 */
const get = (name: string) => {
	const drawer = [...lefts.value, ...rights.value].find(drawer => drawer.name === name)
	const index = drawer ? [...lefts.value, ...rights.value].indexOf(drawer) : -1
	return { drawer, index }
}

/**
 * 閉じる
 * @param {string} [name] - 閉じる Drawer の名前。ない場合は最後に開かれた Drawer を閉じる。 all の場合はすべて閉じる。
 */
const close = (name: string = '') => {
	if (!name) {
		closeOne()
	}
	else if (name === 'all') {
		closeAll()
	}
	else {
		closeOne(name)
	}
}

/**
 * 最後に開かれた Drawer を閉じる
 * @param {string} [name] - 閉じる Drawer の名前。ない場合は最後に開かれた Drawer を閉じる
 */
const closeOne = (name: string = '') => {
	// isOpen.value = false // vue コンポーネントのトランジション終わりに更新する
	let target: Drawer | null = null

	if (name && typeof name === 'string') {
		// 指定された名前のdrawerを探す
		target = [...lefts.value, ...rights.value].find(drawer => drawer.name === name) || null
	}
	else {
		// 名前が指定されていない場合は最後に開かれたdrawerを探す
		const latestLeft = lefts.value[lefts.value.length - 1] || null
		const latestRight = rights.value[rights.value.length - 1] || null

		if (latestLeft && (!latestRight || latestLeft.date > latestRight.date)) {
			target = latestLeft
		}
		else if (latestRight) {
			target = latestRight
		}
	}

	if (target) {
		if (lefts.value.some(drawer => drawer.name === target!.name)) {
			lefts.value = lefts.value.filter(drawer => drawer.name !== target!.name)
		}
		else if (rights.value.some(drawer => drawer.name === target!.name)) {
			rights.value = rights.value.filter(drawer => drawer.name !== target!.name)
		}
	}

	if (resolve.value) {
		resolve.value(false)
	}
	resolve.value = null
}

/**
 * Drawer をすべて閉じる
 */
const closeAll = () => {
	// isOpen.value = false // vue コンポーネントのトランジション終わりに更新する
	lefts.value = []
	rights.value = []
	if (resolve.value) {
		resolve.value(false)
	}
	resolve.value = null
}

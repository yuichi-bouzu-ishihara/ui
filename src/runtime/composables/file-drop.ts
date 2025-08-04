/**
 * ファイルのドロップ関連の便利関数をまとめたファイル
 */

import { nextTick, useState } from '#imports'

export const useFileDrop = () => {
	// Data -------------------------
	const element = useState<HTMLElement | null>('ui-file-drop-element', () => null)
	const dropFiles = useState<File[]>('ui-file-drop-files', () => [])
	const isMouseDownInsideDropArea = useState<boolean>('ui-file-drop-is-mouse-down-inside-drop-area', () => false)
	const enabled = useState<boolean>('ui-file-drop-enabled', () => false)
	const callback = useState<((state: string, files: File[] | null) => void) | null>('ui-file-drop-callback', () => null)

	/**
	 * ファイルのドロップ開始
	 * @param {string} selector - 監視対象のセレクタ
	 * @param {Function} func - ドロップ時のコールバック関数
	 */
	const watch = async (selector: string, func: (state: string, files: File[] | null) => void) => {
		enabled.value = true
		callback.value = func
		await nextTick()
		element.value = document.querySelector(selector)
		dropFiles.value = []
		// console.log('watch', selector, element.value)
		if (element.value) {
			element.value.addEventListener('mousedown', onMouseDown)
			element.value.addEventListener('mouseup', onMouseUp)
			element.value.addEventListener('dragover', onDragOver)
			element.value.addEventListener('drop', onDrop)
			element.value.addEventListener('dragleave', onDragLeave) // 追加
		}
		callback.value?.('start', null)
	}

	/**
	 * ファイルドロップの終了
	 */
	const destroy = () => {
		callback.value?.('destroy', null)
		enabled.value = false
		if (element.value) {
			element.value.removeEventListener('mousedown', onMouseDown)
			element.value.removeEventListener('mouseup', onMouseUp)
			element.value.removeEventListener('dragover', onDragOver)
			element.value.removeEventListener('drop', onDrop)
			element.value.removeEventListener('dragleave', onDragLeave) // 追加
		}
		dropFiles.value = []
		callback.value = null
	}

	const onMouseDown = (event: MouseEvent) => {
		isMouseDownInsideDropArea.value = isInsideDropArea(event)
	}

	const onMouseUp = () => {
		isMouseDownInsideDropArea.value = false
	}

	const onDragLeave = () => {
		// console.log('Drag left the drop area')
		callback.value?.('dragleave', null)
	}

	const onDragOver = (event: DragEvent) => {
		event.preventDefault()
		if (!event.dataTransfer) return
		if (isMouseDownInsideDropArea.value) return
		// console.log('onDragOver', isMouseDownInsideDropArea.value)
		event.dataTransfer.dropEffect = 'copy'
		callback.value?.('dragover', null)
	}

	const onDrop = (event: DragEvent) => {
		event.preventDefault()
		if (!event.dataTransfer) return
		if (isMouseDownInsideDropArea.value) return
		const files = event.dataTransfer.files
		handleFiles(files)
		isMouseDownInsideDropArea.value = false // リセット
		callback.value?.('drop', dropFiles.value)
	}

	const handleFiles = (files: FileList) => {
		dropFiles.value = []
		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			dropFiles.value.push(file)
		}
	}

	const isInsideDropArea = (event: MouseEvent) => {
		if (!element.value) return false
		const rect = element.value.getBoundingClientRect()
		const x = event.clientX
		const y = event.clientY
		const flag = (
			x >= rect.left
			&& x <= rect.right
			&& y >= rect.top
			&& y <= rect.bottom
		)
		// console.log('isInsideDropArea', flag)
		// console.log('x', x, 'rect.width', rect.width, 'y', y, 'rect.height', rect.height)
		return flag
	}

	return {
		watch,
		destroy,
		dropFiles,
		enabled,
	}
}

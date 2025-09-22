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
	const acceptedTypes = useState<string[]>('ui-file-drop-accepted-types', () => ['image'])

	/**
	 * ファイルのドロップ開始
	 * @param {string} selector - 監視対象のセレクタ
	 * @param {Function} func - ドロップ時のコールバック関数
	 * @param {string[]} accepts - 許可するファイルタイプ（デフォルト: ['image']）
	 */
	const watch = async (selector: string, func: (state: string, files: File[] | null) => void, accepts = ['image']) => {
		enabled.value = true
		callback.value = func
		acceptedTypes.value = accepts
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
		const validFiles: File[] = []
		const errors: string[] = []

		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			if (isFileTypeAllowed(file, acceptedTypes.value)) {
				validFiles.push(file)
			}
			else {
				errors.push(`${file.name} は許可されていないファイルタイプです`)
			}
		}

		dropFiles.value = validFiles

		// エラーがある場合はコールバックで通知
		if (errors.length > 0) {
			callback.value?.('error', null)
			console.error('File type validation errors:', errors)
		}
	}

	/**
	 * ファイルタイプが許可されているかチェック
	 * @param {File} file - チェックするファイル
	 * @param {string[]} accepts - 許可するファイルタイプ
	 * @returns {boolean} 許可されているかどうか
	 */
	const isFileTypeAllowed = (file: File, accepts: string[]): boolean => {
		const acceptStrList: string[] = []

		accepts.forEach((accept) => {
			// カスタムのMIMEタイプや拡張子が直接指定されている場合
			if (accept.includes('/') || accept.startsWith('.')) {
				acceptStrList.push(accept)
				return
			}

			// 事前定義されたカテゴリの場合
			switch (accept) {
				case 'image':
					acceptStrList.push('image/*')
					break
				case 'audio':
					acceptStrList.push('audio/*')
					break
				case 'video':
					acceptStrList.push('video/*')
					break
				case 'document':
					acceptStrList.push(
						'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation',
					)
					break
				case 'text':
					acceptStrList.push('text/plain, .txt')
					break
			}
		})

		// ファイルのMIMEタイプをチェック
		for (const acceptStr of acceptStrList) {
			if (acceptStr.includes('*')) {
				// ワイルドカードの場合（例: image/*）
				const baseType = acceptStr.split('/')[0]
				if (file.type.startsWith(baseType + '/')) {
					return true
				}
			}
			else if (acceptStr.startsWith('.')) {
				// 拡張子の場合
				const extension = acceptStr.substring(1)
				const fileName = file.name.toLowerCase()
				if (fileName.endsWith('.' + extension.toLowerCase())) {
					return true
				}
			}
			else if (file.type === acceptStr) {
				// 完全一致の場合
				return true
			}
		}

		return false
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

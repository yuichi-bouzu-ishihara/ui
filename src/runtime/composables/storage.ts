/**
 * @brief Local Storage と Session Storage を管理するストア
 */

import type { StorageConfig } from '../types/storage'
import { useState, readonly, useAppConfig } from '#imports'

// SSR環境でのストレージ利用可能性チェック
const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
	if (import.meta.server) return false

	try {
		const storage = type === 'localStorage' ? window.localStorage : window.sessionStorage
		const testKey = '__storage_test__'
		storage.setItem(testKey, 'test')
		storage.removeItem(testKey)
		return true
	}
	catch {
		return false
	}
}

export const useStorage = () => {
	const prefix = useState('ui-storage-prefix', () => '')
	const config = useState<StorageConfig | null>('ui-storage-config', () => null)

	const getKey = (key: string) => `${prefix.value}${key}`

	// 安全なストレージ操作関数
	const safeStorageOperation = <T>(
		operation: () => T,
		fallback: T,
	): T => {
		try {
			return operation()
		}
		catch (error) {
			console.warn('Storage operation failed:', error)
			return fallback
		}
	}

	const getLocalValue = (key: string): string | null => {
		if (!isStorageAvailable('localStorage')) return null
		return safeStorageOperation(
			() => localStorage.getItem(key),
			null,
		)
	}

	const setLocalValue = (key: string, value: string): boolean => {
		if (!isStorageAvailable('localStorage')) return false
		return safeStorageOperation(
			() => {
				localStorage.setItem(key, value)
				return true
			},
			false,
		)
	}

	const removeLocalItem = (key: string): boolean => {
		if (!isStorageAvailable('localStorage')) return false
		return safeStorageOperation(
			() => {
				localStorage.removeItem(key)
				return true
			},
			false,
		)
	}

	const getSessionValue = (key: string): string | null => {
		if (!isStorageAvailable('sessionStorage')) return null
		return safeStorageOperation(
			() => sessionStorage.getItem(key),
			null,
		)
	}

	const setSessionValue = (key: string, value: string): boolean => {
		if (!isStorageAvailable('sessionStorage')) return false
		return safeStorageOperation(
			() => {
				sessionStorage.setItem(key, value)
				return true
			},
			false,
		)
	}

	const removeSessionItem = (key: string): boolean => {
		if (!isStorageAvailable('sessionStorage')) return false
		return safeStorageOperation(
			() => {
				sessionStorage.removeItem(key)
				return true
			},
			false,
		)
	}

	return {
		init: () => {
			const appConfig = useAppConfig().ui.storage as StorageConfig ?? null
			// 設定がない場合は何もしない
			if (!appConfig) return null

			// 設定を更新
			prefix.value = appConfig.prefix
			config.value = appConfig

			return true
		},
		local: {
			get: (key: string): string | null => {
				return getLocalValue(getKey(key))
			},
			set: (key: string, value: string): boolean => {
				return setLocalValue(getKey(key), value)
			},
			remove: (key: string): boolean => {
				return removeLocalItem(getKey(key))
			},
			// JSONオブジェクト用のヘルパーメソッド
			getObject: <T>(key: string): T | null => {
				const value = getLocalValue(getKey(key))
				if (!value) return null
				try {
					return JSON.parse(value) as T
				}
				catch {
					return null
				}
			},
			setObject: <T>(key: string, value: T): boolean => {
				try {
					const jsonValue = JSON.stringify(value)
					return setLocalValue(getKey(key), jsonValue)
				}
				catch {
					return false
				}
			},
		},
		session: {
			get: (key: string): string | null => {
				return getSessionValue(getKey(key))
			},
			set: (key: string, value: string): boolean => {
				return setSessionValue(getKey(key), value)
			},
			remove: (key: string): boolean => {
				return removeSessionItem(getKey(key))
			},
			// JSONオブジェクト用のヘルパーメソッド
			getObject: <T>(key: string): T | null => {
				const value = getSessionValue(getKey(key))
				if (!value) return null
				try {
					return JSON.parse(value) as T
				}
				catch {
					return null
				}
			},
			setObject: <T>(key: string, value: T): boolean => {
				try {
					const jsonValue = JSON.stringify(value)
					return setSessionValue(getKey(key), jsonValue)
				}
				catch {
					return false
				}
			},
		},
		config: readonly(config),
		prefix: readonly(prefix),
	}
}

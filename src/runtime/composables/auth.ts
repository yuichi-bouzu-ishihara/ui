/**
 * 認証に関する関数をまとめたファイル
 */
import { useUtils } from './utils'
import { useCookie, useState, computed } from '#imports'
import type { CookieRef } from '#app'

export const useAuth = () => {
	const initFlag = useState('ui-auth-initFlag', () => false)
	const tokenKey = useState('ui-auth-tokenKey', () => '')
	const domain = useState('ui-auth-domain', () => '')
	const maxAge = useState('ui-auth-maxAge', () => 0) // 有効期限を秒数で指定。一旦、一ヶ月
	const cookie = useState<CookieRef<string | null | undefined> | null>('ui-auth-cookie', () => null)
	const token = computed(() => cookie.value || '')
	const loggedIn = computed(() => typeof token.value === 'string' && token.value.length > 0)

	/**
	 * ログインする
	 * @param {string} value トークン
	 */
	const login = (value: string): void => {
		const newCookie = useCookie(tokenKey.value, { maxAge: maxAge.value, domain: domain.value, path: '/', secure: true, sameSite: 'lax' })
		newCookie.value = value
		cookie.value = newCookie
	}

	/**
	 * ログアウトする
	 */
	const logout = async () => {
		const newCookie = useCookie(tokenKey.value, { maxAge: maxAge.value, domain: domain.value, path: '/', secure: true, sameSite: 'lax' })
		newCookie.value = null
		cookie.value = newCookie

		// cookie が残っている場合は、ログアウト処理を再度実行する
		if (cookie.value?.value) {
			await useUtils().wait(100)
			logout()
		}
	}

	return {
		initFlag,
		token,
		loggedIn,
		login,
		logout,

		/**
		 * 初期化する
		 * @param {string} key - トークンキー
		 * @param {string} dom - ドメイン
		 * @param {number} mxAge - 有効期限
		 * @returns {void}
		 */
		init: (key: string, dom: string, mxAge: number = 60 * 60 * 24 * 31) => {
			if (initFlag.value) return
			if (!key || !dom) {
				throw new Error('Please set tokenKey and domain')
			}
			tokenKey.value = key
			domain.value = dom
			maxAge.value = mxAge
			cookie.value = useCookie(tokenKey.value, { maxAge: maxAge.value, domain: domain.value, path: '/', secure: true, sameSite: 'lax' })
			initFlag.value = true
		},
	}
}

/**
 * 認証に関する関数をまとめたファイル
 */
import { computed, type Ref } from 'vue'
import { ref } from '@vue/reactivity'
import { useUtils } from './utils'
import { useRuntimeConfig, useCookie } from '#imports'

export const useAuth = (): {
	token: Ref<string>
	loggedIn: Ref<boolean>
	login: (value: string) => void
	logout: () => void
} => {
	const TOKEN_KEY = useRuntimeConfig().public.TOKEN_KEY
	const DOMAIN = useRuntimeConfig().public.DOMAIN
	const MAX_AGE = 60 * 60 * 24 * 31 // 有効期限を秒数で指定。一旦、一ヶ月
	const cookie = useCookie(TOKEN_KEY, { maxAge: MAX_AGE, domain: DOMAIN, path: '/', secure: true, sameSite: 'lax' })
	const token = ref(cookie.value || '')
	const loggedIn = computed(() => token.value.length > 0)

	/**
	 * ログインする
	 * @param {string} value トークン
	 */
	const login = (value: string): void => {
		cookie.value = value
		token.value = value
	}

	/**
	 * ログアウトする
	 */
	const logout = async () => {
		cookie.value = null
		token.value = ''

		// cookie が残っている場合は、ログアウト処理を再度実行する
		if (cookie.value) {
			await useUtils().wait(100)
			logout()
		}
	}

	return { token, loggedIn, login, logout }
}

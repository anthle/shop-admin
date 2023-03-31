import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies()
const tokenKey = 'admin-token'

export function getToken() {
	return cookies.get(tokenKey)
}

export function setToken(token: string) {
	cookies.set(tokenKey, token)
}

export function removeToken() {
	cookies.remove(tokenKey)
}

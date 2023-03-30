import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/service'
import { useCookies } from '@vueuse/integrations/useCookies'
import router from '@/router'

export const useLoginStore = defineStore('login', {
	state: () => ({}),
	actions: {
		async loginAction(username: string, password: string) {
			const res = await login(username, password)
			const cookies = useCookies()
			cookies.set('admin-token', res.data.data.token)

			const res1 = await getUserInfo()
			console.log(res1)

			router.push('/index')
		}
	}
})

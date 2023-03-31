import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/service'
import router from '@/router'
import { toast } from '@/composables/useEle'
import { removeToken, setToken } from '@/composables/auth'

export const useLoginStore = defineStore('login', {
	state: () => ({
		userInfo: {}
	}),
	actions: {
		async loginAction(username: string, password: string) {
			const res = await login(username, password)
			toast('登录成功')
			setToken(res.data.data.token)

			router.push('/index')
		},
		async getUserInfoAction() {
			const res = await getUserInfo()
			this.userInfo = res.data.data
		},
		async logoutAction() {
			await logout()
			removeToken()
			toast('退出登录成功')
			this.userInfo = {}
			router.push('/login')
		}
	}
})

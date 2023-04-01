import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/service'
import router from '@/router'
import { toast } from '@/composables/useEle'
import { removeToken, setToken, getToken } from '@/composables/auth'
import state from './state'
import { updatePassword } from '@/service'

export const useLoginStore = defineStore('login', {
	state: () => state,
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
			localStorage.setItem('userInfo', JSON.stringify(res.data.data))
		},
		async logoutAction() {
			await logout()
			removeToken()
			toast('退出登录成功')
			this.userInfo = {}
			router.push('/login')
		},
		loadlocalCacheAction() {
			const token = getToken()
			const userInfo = localStorage.getItem('userInfo')

			if (token && userInfo) {
				this.userInfo = JSON.parse(userInfo)
			}
		},
		async updatePasswordAction(data: any) {
			try {
				await updatePassword(data)
			} catch (error: any) {
				const msg = error.response.data.msg
				// 处理错误响应
				if (msg === '你运行到这一步，代表已经修改成功了，但由于当前账号是课程演示账号，所以不会真实修改~') {
					toast('修改密码成功,请重新登录')
					this.logoutAction()
				}
			}
		}
	}
})

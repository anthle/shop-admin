import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/service'
import router, { mapMenusToRoutes } from '@/router'
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

			// 获取用户信息
			const res1 = await getUserInfo()
			this.userInfo = res1.data.data
			localStorage.setItem('userInfo', JSON.stringify(res1.data.data))
			console.log(this.userInfo)

			mapMenusToRoutes(this.userInfo.menus)

			router.push('/')
		},
		async logoutAction() {
			await logout()
			removeToken()
			toast('退出登录成功')
			this.userInfo = {}
			router.push('/login')
		},
		// 从本地缓存中加载用户信息
		loadlocalCacheAction() {
			const token = getToken()
			const userInfo = localStorage.getItem('userInfo')

			if (token && userInfo) {
				this.userInfo = JSON.parse(userInfo)
				mapMenusToRoutes(this.userInfo.menus)
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

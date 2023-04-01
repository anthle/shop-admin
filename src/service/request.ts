import axios from 'axios'
import { getToken } from '@/composables/auth'
import { toast } from '@/composables/useEle'
import { hideFullLoading, showFullLoading } from '@/composables/utils'
import { useLoginStore } from '@/stores/login'

const instance = axios.create({
	baseURL: '/api',
	withCredentials: true
})

instance.interceptors.request.use(
	(config) => {
		showFullLoading()
		const token = getToken()

		if (config.headers && token) {
			config.headers['token'] = token
			// config.headers.Authorization = 'Bearer ' + token
		}

		return config
	},
	(error) => {
		hideFullLoading()
		return Promise.reject(error)
	}
)

instance.interceptors.response.use(
	(data) => {
		hideFullLoading()
		return data
	},
	(error) => {
		const { logoutAction } = useLoginStore()
		const msg = error.response.data.msg
		if (msg === '非法token，请先登录！') {
			logoutAction().finally(() => {
				location.reload()
			})
		}
		hideFullLoading()
		toast(msg || '登录失败', 'error')
		return Promise.reject(error)
	}
)

export default instance

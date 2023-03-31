import axios from 'axios'
import { getToken } from '@/composables/auth'
import { toast } from '@/composables/useEle'

const instance = axios.create({
	baseURL: '/api',
	withCredentials: true
})

instance.interceptors.request.use(
	(config) => {
		const token = getToken()

		if (config.headers && token) {
			config.headers['token'] = token
			// config.headers.Authorization = 'Bearer ' + token
		}

		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

instance.interceptors.response.use(
	(data) => {
		return data
	},
	(error) => {
		toast(error.response.data.msg || '登录失败', 'error')
		return Promise.reject(error)
	}
)

export default instance

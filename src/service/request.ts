import axios from 'axios'
import { useCookies } from '@vueuse/integrations/useCookies'

const instance = axios.create({
	baseURL: '/api',
	withCredentials: true
})

instance.interceptors.request.use(
	(config) => {
		const cookies = useCookies()
		const token = cookies.get('admin-token')

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
		ElNotification({
			title: 'Error',
			message: error.response.data.msg || '登录失败',
			type: 'error'
		})
		return Promise.reject(error)
	}
)

export default instance

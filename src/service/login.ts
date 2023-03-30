import request from './request'

export function login(username: string, password: string) {
	return request.post('/admin/login', {
		username,
		password
	})
}

export function getUserInfo() {
	return request.post('/admin/getinfo')
}

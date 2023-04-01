import request from './request'

export function updatePassword(data: any) {
	return request.post('/admin/updatepassword', data)
}

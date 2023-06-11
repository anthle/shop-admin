import request from '../request'

export function getUserLevelList(page: number) {
	return request.get(`/admin/user_level/${page}`)
}

export function createUserLevel(data: any) {
	return request.post('/admin/user_level', data)
}

export function updateUserLevel(id: any, data: any) {
	return request.post(`/admin/user_level/${id}`, data)
}

export function deleteUserLevel(id: any) {
	return request.post(`/admin/user_level/${id}/delete`)
}

export function updateUserLevelStatus(id: number, status: any) {
	return request.post(`/admin/user_level/${id}/update_status`, { status })
}

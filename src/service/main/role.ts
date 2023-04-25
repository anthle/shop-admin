import request from '../request'

export function getRoleList(page: number) {
	return request.get(`/admin/role/${page}`)
}

export function createRole(data: any) {
	return request.post('/admin/role', data)
}

export function updateRole(id: any, data: any) {
	return request.post(`/admin/role/${id}`, data)
}

export function deleteRole(id: any) {
	return request.post(`/admin/role/${id}/delete`)
}

import request from '../request'

export function getUserList(page: number, query: any = {}) {
	const q = []
	for (const key in query) {
		if (query[key]) {
			q.push(`${key}=${encodeURIComponent(query[key])}`)
		}
	}
	let r = q.join('&')
	r = r ? '?' + r : ''

	return request.get(`/admin/user/${page}${r}`)
}

export function updateUserStatus(id: number, status: any) {
	return request.post(`/admin/user/${id}/update_status`, { status })
}

export function createUser(data: any) {
	return request.post(`/admin/user`, data)
}

export function updateUser(id: number, data: any) {
	return request.post(`/admin/user/${id}`, data)
}

export function deleteUser(id: number | number[]) {
	return request.post(`/admin/user/${id}/delete`)
}

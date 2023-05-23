import request from '../request'

export function getManagerList(page: number, query: any = {}) {
	const q = []
	for (const key in query) {
		if (query[key]) {
			q.push(`${key}=${encodeURIComponent(query[key])}`)
		}
	}
	let r = q.join('&')
	r = r ? '?' + r : ''

	return request.get(`/admin/manager/${page}${r}`)
}

export function updateManagerStatus(id: number, status: any) {
	return request.post(`/admin/manager/${id}/update_status`, { status })
}

export function createManager(data: any) {
	return request.post(`/admin/manager`, data)
}

export function updateManager(id: number, data: any) {
	return request.post(`/admin/manager/${id}`, data)
}

export function deleteManager(id: number | number[]) {
	return request.post(`/admin/manager/${id}/delete`)
}

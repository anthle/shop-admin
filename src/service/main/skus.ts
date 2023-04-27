import request from '../request'

export function getSkusList(page: number) {
	return request.get(`/admin/skus/${page}`)
}

export function createSkus(data: any) {
	return request.post('/admin/skus', data)
}

export function updateSkus(id: any, data: any) {
	return request.post(`/admin/skus/${id}`, data)
}

export function deleteSkus(ids: any) {
	if (!Array.isArray(ids)) {
		ids = [ids]
	}
	return request.post('/admin/skus/delete_all', { ids })
}

export function updateSkusStatus(id: number, status: any) {
	return request.post(`/admin/skus/${id}/update_status`, { status })
}

export function setSkusRules(id: number, status: any) {
	return request.post(`/admin/skus/${id}/update_status`, {
		status
	})
}

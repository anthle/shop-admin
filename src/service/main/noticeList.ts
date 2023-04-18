import request from '../request'

export function getNoticeList(page: number) {
	return request.get(`/admin/notice/${page}`)
}

export function createNotice(data: any) {
	return request.post('/admin/notice', data)
}

export function updateNotice(id: any, data: any) {
	return request.post(`/admin/notice/${id}`, data)
}

export function deleteNotice(id: any) {
	return request.post(`/admin/notice/${id}/delete`)
}

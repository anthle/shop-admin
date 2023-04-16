import request from '../request'

export function getImageList(page: any) {
	return request.get('/admin/image_class/' + page)
}

export function createImageClass(data: any) {
	return request.post('admin/image_class', data)
}

export function updateImageClass(id: any, data: any) {
	return request.post(`admin/image_class/${id}`, data)
}

export function deleteImageClass(id: any) {
	return request.post(`/admin/image_class/${id}/delete`)
}

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

export function getImageListById(id: any, page: any) {
	return request.get(`/admin/image_class/${id}/image/${page}?limit=10`)
}

export function updateImageName(id: number, name: any) {
	return request.post(`/admin/image/${id}`, { name })
}

export function deleteImage(ids: any) {
	return request.post('/admin/image/delete_all', { ids })
}

export const uploadImgAction = '/api/admin/image/upload'

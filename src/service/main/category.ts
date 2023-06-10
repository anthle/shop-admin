import request from '../request'

export function getCategoryList() {
	return request.get('/admin/category')
}

export function updateCategoryList(id: number, data: any) {
	return request.post(`/admin/category/${id}`, data)
}

export function createCategoryList(data: any) {
	return request.post('/admin/category', data)
}

export function updateCategoryStates(id: number, status: any) {
	return request.post(`/admin/category/${id}/update_status`, { status })
}

export function deleteCategory(id: number | number[]) {
	return request.post(`/admin/category/${id}/delete`)
}

export function getCategoryGoods(id: number | number[]) {
	return request.get(`/admin/app_category_item/list?category_id=${id}`)
}

export function deleteCategoryGoods(id: number | number[]) {
	return request.post(`/admin/app_category_item/${id}/delete`)
}

export function connectCategoryGoods(data: any) {
	return request.post(`/admin/app_category_item`, data)
}

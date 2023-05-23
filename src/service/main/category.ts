import request from '../request'

export function getCategoryList() {
	return request.get('/admin/category')
}

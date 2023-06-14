import request from '../request'

export function getGoodsCommentList(page: number, query: any = {}) {
	const q = []
	for (const key in query) {
		if (query[key]) {
			q.push(`${key}=${encodeURIComponent(query[key])}`)
		}
	}
	let r = q.join('&')
	r = r ? '?' + r : ''

	return request.get(`/admin/goods_comment/${page}${r}`)
}

export function updateGoodsCommentStatus(id: number, status: any) {
	return request.post(`/admin/manager/${id}/update_status`, { status })
}

export function reviewGoodsComment(id: number, data: any) {
	return request.post(`/admin/goods_comment/review/${id}`, { data })
}

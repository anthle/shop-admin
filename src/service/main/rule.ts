import request from '../request'

export function getRuleList(page: number) {
	return request.get(`/admin/rule/${page}`)
}

export function updateRuleList(id: number, data: any) {
	return request.post(`/admin/rule/193/${id}`, data)
}

export function createRuleList(data: any) {
	return request.post('/admin/rule', data)
}

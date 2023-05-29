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

export function updateRuleStates(id: number, status: any) {
	return request.post(`/admin/rule/${id}/update_status`, { status })
}

export function deleteRule(id: number | number[]) {
	return request.post(`/admin/rule/${id}/delete`)
}

import request from '../request'

export function getStatistics() {
	return request.get('/admin/statistics1')
}

export function getStatistics3(query: any) {
	return request.get(`/admin/statistics3?type=${query}`)
}

export function getStatistics2() {
	return request.get('/admin/statistics2')
}

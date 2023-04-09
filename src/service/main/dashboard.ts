import request from '../request'

export function getStatistics() {
	return request.get('/admin/statistics1')
}

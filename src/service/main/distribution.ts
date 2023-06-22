import request from '../request'

export function getAgentStatistics() {
	return request.get(`/admin/agent/statistics`)
}

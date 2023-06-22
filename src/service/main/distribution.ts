import request from '../request'
import { queryParams } from '@/composables/utils'

export function getAgentStatistics() {
	return request.get(`/admin/agent/statistics`)
}

export function getAgentList(page: number, query: any = {}) {
	const r = queryParams(query)
	return request.get(`/admin/agent/${page}${r}`)
}

export function getAgentOrderList(page: number, query: any = {}) {
	const r = queryParams(query)
	return request.get(`/admin/user_bill/${page}${r}`)
}

export function getConfig() {
	return request.get(`/admin/distribution_setting/get`)
}

export function setConfig(data: any) {
	return request.post(`/admin/distribution_setting/set`, data)
}

import request from '../request'
import { queryParams } from '@/composables/utils'

export function getOrderList(page: number, query: any = {}) {
	const r = queryParams(query)
	return request.get(`/admin/order/${page}${r}`)
}

export function deleteOrder(ids: number | number[]) {
	return request.post(`/admin/order/delete_all`, {
		ids
	})
}

export function exportOrder(query: any = {}) {
	const r = queryParams(query)
	return request.post(
		`/admin/order/excelexport${r}`,
		{},
		{
			responseType: 'blob'
		}
	)
}

export function getShipInfo(id: number | number[]) {
	return request.get(`/admin/order/${id}/get_ship_info`)
}

export function refundOrder(id: number | number[], data: { agree: number; disagree_reason?: string }) {
	return request.post(`/admin/order/${id}/handle_refund`, data)
}

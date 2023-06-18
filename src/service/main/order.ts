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

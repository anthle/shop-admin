import request from '../request'
import { queryParams } from '@/composables/utils'

export function getGoodsList(page: number, query: any = {}) {
	const r = queryParams(query)
	return request.get(`/admin/goods/${page}${r}`)
}

// 批量上架下架
export function updateGoodsStatus(ids: any, status: number) {
	return request.post(`admin/goods/changestatus`, {
		ids,
		status
	})
}

export function createGoods(data: any) {
	return request.post(`/admin/goods`, data)
}

export function updateGoods(id: number, data: any) {
	return request.post(`/admin/goods/${id}`, data)
}

export function deleteGoods(ids: number | number[]) {
	return request.post(`/admin/goods/delete_all`, {
		ids
	})
}

export function readGoods(id: number) {
	return request.get(`/admin/goods/read/${id}`)
}

export function setGoodsBanner(id: number, banners: any) {
	return request.post(`/admin/goods/banners/${id}`, {
		banners
	})
}

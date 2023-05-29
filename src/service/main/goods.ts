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

export function updateGoodsSkus(id: number, data: any) {
	return request.post(`/admin/goods/updateskus/${id}`, {
		data
	})
}

export function createGoodsSkusCard(data: any) {
	return request.post(`/admin/goods_skus_card`, data)
}

export function updateGoodsSkusCard(id: number, data: any) {
	return request.post(`/admin/goods_skus_card/${id}`, data)
}

export function deleteGoodsSkusCard(id: any) {
	return request.post(`/admin/goods_skus_card/${id}/delete`)
}

export function sortGoodsSkusCard(data: any) {
	return request.post(`/admin/goods_skus_card/sort`, data)
}

export function createGoodsSkusCardValue(data: any) {
	return request.post(`/admin/goods_skus_card_value`, data)
}

export function updateGoodsSkusCardValue(id: any, data: any) {
	return request.post(`/admin/goods_skus_card_value/${id}`, data)
}

export function deleteGoodsSkusCardValue(id: any) {
	return request.post(`/admin/goods_skus_card_value/${id}/delete`)
}

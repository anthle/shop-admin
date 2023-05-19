import request from '../request'

export function getCoupon(page: number) {
	return request.get(`/admin/coupon/${page}`)
}

export function createCoupon(data: any) {
	return request.post('/admin/coupon', data)
}

export function updateCoupon(id: any, data: any) {
	return request.post(`/admin/coupon/${id}`, data)
}

export function deleteCoupon(id: any) {
	return request.post(`/admin/coupon/${id}/delete`)
}

export function updateCouponStatus(id: any) {
	return request.post(`/admin/coupon/${id}/update_status`, {
		status: 0
	})
}

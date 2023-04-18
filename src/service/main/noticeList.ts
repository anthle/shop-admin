import request from '../request'

export function getNoticeList(page: number) {
	return request.get(`/admin/notice/${page}`)
}

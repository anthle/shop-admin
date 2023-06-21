import request from '../request'

export function getSysConfig() {
	return request.get('/admin/sysconfig')
}

export function setSysConfig(data: any) {
	return request.post('/admin/sysconfig', data)
}

export const uploadAction = '/api/admin/sysconfig/upload'

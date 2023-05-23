import NProgress from 'nprogress'

export function showFullLoading() {
	NProgress.start()
}

export function hideFullLoading() {
	NProgress.done()
}

// 将query对象转换成url参数
export function queryParams(query: any) {
	const q = []
	for (const key in query) {
		if (query[key]) {
			q.push(`${key}=${encodeURIComponent(query[key])}`)
		}
	}
	let r = q.join('&')
	r = r ? '?' + r : ''
	return r
}

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

// 交换数组索引
export function swapIndex(arr: Array<any>, index1: number, index2: number) {
	arr[index1] = arr.splice(index2, 1, arr[index1])[0]
	return arr
}

// 上移
export function useArrayMoveUp(arr: Array<any>, index: number) {
	swapIndex(arr, index, index - 1)
}
// 下移
export function useArrayMoveDown(arr: Array<any>, index: number) {
	swapIndex(arr, index, index + 1)
}

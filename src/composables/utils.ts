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
// sku排列算法
export function cartesianProductOf<T>(...arrays: T[][]): T[][] {
	return arrays.reduce(
		(acc: T[][], curr: T[]) => {
			const ret: T[][] = []
			acc.forEach((a: T[]) => {
				curr.forEach((b: T) => {
					ret.push([...a, b])
				})
			})
			return ret
		},
		[[]]
	)
}

// 导出表格

export function downloadExcelFile(data: any) {
	const url = window.URL.createObjectURL(new Blob([data]))
	const link = document.createElement('a')
	link.style.display = 'none'
	link.href = url
	const filename = new Date().getTime() + '.xlsx'
	link.setAttribute('download', filename)
	document.body.appendChild(link)
	link.click()
}

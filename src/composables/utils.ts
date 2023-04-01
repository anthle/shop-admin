import NProgress from 'nprogress'

export function showFullLoading() {
	NProgress.start()
}

export function hideFullLoading() {
	NProgress.done()
}

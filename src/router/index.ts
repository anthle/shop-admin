import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '@/composables/auth'
import { toast } from '@/composables/useEle'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			redirect: '/index'
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../pages/login/login.vue'),
			meta: {
				title: '登录页'
			}
		},
		{
			path: '/index',
			name: 'index',
			component: () => import('../pages/index/index.vue'),
			meta: {
				title: '首页'
			}
		},
		{
			path: '/:pathMatch(.*)*',
			component: () => import('../pages/404/404.vue')
		}
	]
})

router.beforeEach((to, from) => {
	const token = getToken()

	if (to.path !== '/login' && !token) {
		toast('请先登录', 'error')
		return '/login'
	}

	if (token && to.path === '/login') {
		toast('您已登录', 'info')
		return from.path
	}
	const title = to.meta.title
	document.title = title
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '@/composables/auth'
import { toast } from '@/composables/useEle'
import { useLoginStore } from '@/stores/login'

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
			path: '/',
			component: () => import('../layout/admin.vue'),
			children: [
				{
					path: 'index',
					component: () => import('../pages/index/index.vue'),
					meta: {
						title: '首页'
					}
				}
			]
		},
		{
			path: '/:pathMatch(.*)*',
			component: () => import('../pages/404/404.vue')
		}
	]
})

router.beforeEach((to, from) => {
	const token = getToken()
	const { loadlocalCacheAction } = useLoginStore()

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

	loadlocalCacheAction()
})

export default router

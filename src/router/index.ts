import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '@/composables/auth'
import { toast } from '@/composables/useEle'
import { asyncRoutes } from './asyncRoutes'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
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
			name: 'admin',
			component: () => import('../layout/admin.vue')
		},
		{
			path: '/:pathMatch(.*)*',
			component: () => import('../pages/404/404.vue')
		}
	]
})

// 递归遍历菜单，将菜单对应的路由添加到路由表中
export function mapMenusToRoutes(userMenus: any) {
	const findAndAddRoutesByMenus = (menus: any) => {
		menus.forEach((e: any) => {
			const item = asyncRoutes.find((o) => {
				return o.path === e.frontpath
			})

			if (item && !router.hasRoute(item.path)) {
				router.addRoute('admin', item)
			}
			if (e.child && e.child.length) {
				findAndAddRoutesByMenus(e.child)
			}
		})
	}

	findAndAddRoutesByMenus(userMenus)
}

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

import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../pages/login/login.vue')
		},
		{
			path: '/:pathMatch(.*)*',
			component: () => import('../pages/404/404.vue')
		}
	]
})

export default router

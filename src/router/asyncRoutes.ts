export const asyncRoutes = [
	{
		path: '/',
		name: '/',
		component: () => import('../pages/index/index.vue'),
		meta: {
			title: '首页'
		}
	},
	{
		path: '/goods/list',
		name: 'Goods',
		component: () => import('../pages/goods/goods.vue'),
		meta: {
			title: '商品信息'
		}
	},
	{
		path: '/category/list',
		name: 'Category',
		component: () => import('../pages/category/category.vue'),
		meta: {
			title: '分类'
		}
	},
	{
		path: '/user/list',
		name: 'User',
		component: () => import('../pages/user/list.vue'),
		meta: {
			title: '用户列表'
		}
	},
	{
		path: '/comment/list',
		name: 'comment',
		component: () => import('../pages/comment/list.vue'),
		meta: {
			title: '评价列表'
		}
	},
	{
		path: '/image/list',
		name: 'Image',
		component: () => import('../pages/image/list.vue'),
		meta: {
			title: '图库列表'
		}
	},
	{
		path: '/notice/list',
		name: 'Notice',
		component: () => import('../pages/notice/list.vue'),
		meta: {
			title: '公告列表'
		}
	},
	{
		path: '/setting/base',
		name: 'Setting',
		component: () => import('../pages/setting/base.vue'),
		meta: {
			title: '配置列表'
		}
	},
	{
		path: '/coupon/list',
		name: 'Coupon',
		component: () => import('../pages/coupon/list.vue'),
		meta: {
			title: '优惠券列表'
		}
	},
	{
		path: '/order/list',
		name: 'Order',
		component: () => import('../pages/order/list.vue'),
		meta: {
			title: '优惠券列表'
		}
	}
]
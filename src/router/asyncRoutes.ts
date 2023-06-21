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
		path: '/setting/buy',
		name: 'Buy',
		component: () => import('../pages/setting/buy.vue'),
		meta: {
			title: '支付设置'
		}
	},
	{
		path: '/setting/ship',
		name: 'Ship',
		component: () => import('../pages/setting/ship.vue'),
		meta: {
			title: '物流设置'
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
			title: '订单列表'
		}
	},
	{
		path: '/manager/list',
		name: 'Manager',
		component: () => import('../pages/manager/list.vue'),
		meta: {
			title: '管理员列表'
		}
	},
	{
		path: '/access/list',
		name: 'Access',
		component: () => import('../pages/access/list.vue'),
		meta: {
			title: '管理员权限'
		}
	},
	{
		path: '/role/list',
		name: 'Role',
		component: () => import('../pages/role/list.vue'),
		meta: {
			title: '角色管理'
		}
	},
	{
		path: '/skus/list',
		name: 'Skus',
		component: () => import('../pages/skus/list.vue'),
		meta: {
			title: '规格管理'
		}
	},
	{
		path: '/level/list',
		name: 'Level',
		component: () => import('../pages/level/list.vue'),
		meta: {
			title: '会员等级'
		}
	}
]

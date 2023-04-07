<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import type { TabPaneName } from 'element-plus'

const route = useRoute()

const router = useRouter()

const cookie = useCookies()

const activeTab = ref(route.path)

const tabsList = ref([
	{
		title: '后台首页',
		path: '/'
	}
])

// 监听路由变化，添加标签页
onBeforeRouteUpdate((to) => {
	const hasTab = tabsList.value.findIndex((item) => item.path === to.path)
	activeTab.value = to.path

	if (hasTab === -1) {
		tabsList.value.push({
			title: to.meta.title,
			path: to.path
		})
		cookie.set('tabsList', tabsList.value)
	}
})

if (cookie.get('tabsList')) {
	tabsList.value = cookie.get('tabsList')
}

const tabChange = (tabName: TabPaneName) => {
	router.push(tabName as string)
}

// 关闭标签页
const tabRemove = (tabName: TabPaneName) => {
	const index = tabsList.value.findIndex((item) => item.path === tabName)
	const nextTab = tabsList.value[index + 1] || tabsList.value[index - 1]
	if (nextTab) {
		activeTab.value = nextTab.path
		router.push(nextTab.path)
	} else {
		router.push('/')
	}

	tabsList.value.splice(index, 1)
	cookie.set('tabsList', tabsList.value)
}

const handleCommand = (command: string) => {
	if (command === 'closeOther') {
		tabsList.value = tabsList.value.filter((item) => {
			return item.path === activeTab.value || item.path === '/'
		})
	} else {
		tabsList.value.splice(1)
		activeTab.value = '/'
	}
	cookie.set('tabsList', tabsList.value)
}

defineProps<{
	isFold: boolean
}>()
</script>

<template>
	<div
		class="fixed top-[64px] right-0 h-[44px] flex items-center bg-gray-100 z-10"
		:style="{ left: isFold ? '64px' : '250px' }"
	>
		<el-tabs v-model="activeTab" type="card" style="min-width: 100px" @tab-change="tabChange" @tab-remove="tabRemove">
			<el-tab-pane
				v-for="item in tabsList"
				:key="item.path"
				:label="item.title"
				:name="item.path"
				:closable="item.path !== '/'"
			>
			</el-tab-pane>
		</el-tabs>
		<span class="bg-white rounded flex justify-center items-center ml-auto mx-2 h-8 w-8 cursor-pointer">
			<el-dropdown @command="handleCommand">
				<span class="el-dropdown-link">
					<el-icon>
						<arrow-down />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
						<el-dropdown-item command="closeAll">全部关闭</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</span>
	</div>
</template>

<style lang="less" scoped>
:deep(.el-tabs__header) {
	margin: 0;
	border-bottom: none;
	@apply flex items-center;
}
:deep(.el-tabs__nav) {
	border: 0 !important;
}
:deep(.el-tabs__item) {
	border-left: 0 !important;
	height: 32px;
	@apply bg-white mx-2 rounded leading-8;
}
:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
	height: 32px;
	line-height: 32px;
}
:deep(.is-disabled) {
	cursor: not-allowed;
	opacity: 0.5;
}
</style>

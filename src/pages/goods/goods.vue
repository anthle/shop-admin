<script setup lang="ts">
import { getGoodsList, updateGoodsStatus, createGoods, updateGoods, deleteGoods } from '@/service/main/goods'
import { getCategoryList } from '@/service/main/category'
import formDrawer from '@/components/formDrawer.vue'
import chooseImage from '@/components/chooseImage.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'
import Search from '@/components/search.vue'
import SearchItem from '@/components/searchItem.vue'

const roles = ref([] as any[])

const {
	tableData,
	searchForm,
	loading,
	total,
	currentPage,
	resetSearchForm,
	getData,
	handleDelete,
	handleChangeStatus
} = useInitTable({
	searchForm: {
		title: '',
		tab: 'all',
		category_id: null
	},
	getList: getGoodsList,
	delete: deleteGoods,
	updateStatus: updateGoodsStatus,
	onGetListSuccess: (res: any) => {
		tableData.value = res.data.data.list.map((item: any) => {
			item.statusLoading = false
			return item
		})
		total.value = res.data.data.totalCount
		roles.value = res.data.data.roles
	}
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		username: '',
		password: '',
		role_id: [] as any[],
		status: 1,
		avatar: ''
	},
	currentPage,
	getData,
	update: updateGoods,
	create: createGoods
})

const tabbars = [
	{
		label: '全部',
		name: 'all'
	},
	{
		label: '审核中',
		name: 'checking'
	},
	{
		label: '出售中',
		name: 'saling'
	},
	{
		label: '已下架',
		name: 'off'
	},
	{
		label: '库存预警',
		name: 'min_stock'
	},
	{
		label: '回收站',
		name: 'delete'
	}
]

const category_list = ref()
getCategoryList().then((res) => {
	category_list.value = res.data.data
})
</script>

<template>
	<el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData()">
		<el-tab-pane :label="item.label" :name="item.name" v-for="item in tabbars" :key="item.label"></el-tab-pane>
	</el-tabs>
	<!-- 搜索 -->
	<el-card shadow="never" class="border-0">
		<Search :model="searchForm" @search="getData()" @reset="resetSearchForm">
			<SearchItem label="关键词">
				<el-input v-model="searchForm.title" placeholder="商品名称" clearable @keydown.enter="getData()"></el-input>
			</SearchItem>
			<template #show>
				<SearchItem label="商品分类">
					<el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
						<el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id"> </el-option>
					</el-select>
				</SearchItem>
			</template>
		</Search>

		<!-- 新增 -->
		<listHeader @create="handleCreate" @refresh="getData()"></listHeader>

		<!-- 表格 -->
		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column prop="title" label="商品" width="300">
				<template #default="{ row }">
					<div class="flex">
						<el-image
							class="mr-3 rounded"
							:src="row.cover"
							fit="cover"
							:lazy="true"
							style="width: 50px; height: 50px"
						></el-image>
						<div class="flex-1">
							<span>{{ row.title }}</span>
							<div>
								<span class="text-rose-500">¥{{ row.min_price }}</span>
								<el-divider direction="vertical" />
								<span class="text-gray-500 text-xs">¥{{ row.min_oprice }}</span>
							</div>
							<div class="text-gray-400 text-xs mb-1">分类:{{ row.category ? row.category.name : '未分类' }}</div>
							<span class="text-gray-400 text-xs">创建时间:{{ row.create_time }}</span>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="sale_count" label="实际销量" align="center" width="70"></el-table-column>
			<el-table-column label="商品状态" align="center" width="100">
				<template #default="{ row }">
					<el-tag :type="row.status ? 'success' : 'danger'">{{ row.status ? '上架' : '仓库' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="审核状态" align="center" width="120" v-if="searchForm.tab != 'delete'">
				<template #default="{ row }">
					<div class="flex flex-col" v-if="row.ischeck == 0">
						<el-button type="success" size="small" plain>审核通过</el-button>
						<el-button class="mt-2 !ml-0" type="danger" size="small" plain>审核拒绝</el-button>
					</div>
					<span v-else>{{ row.ischeck == 1 ? '通过' : '拒绝' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="stock" label="总库存" align="center" width="90"></el-table-column>
			<el-table-column label="操作" align="center">
				<template #default="{ row }">
					<div v-if="searchForm.tab != 'delete'">
						<el-button class="px-1" type="primary" size="small" text @click="handleUpdate(row)">修改</el-button>
						<el-button class="px-1" type="primary" size="small" text>商品规格</el-button>
						<el-button class="px-1" type="primary" size="small" text>商品轮播图</el-button>
						<el-button class="px-1" type="primary" size="small" text>商品详情</el-button>
						<el-popconfirm
							title="是否要删除该管理员?"
							confirm-button-text="确定"
							cancel-button-text="取消"
							width="180"
							@confirm="handleDelete(row.id)"
						>
							<template #reference>
								<el-button class="px-1" type="primary" size="small" text>删除</el-button>
							</template>
						</el-popconfirm>
					</div>
					<span v-else>暂无操作</span>
				</template>
			</el-table-column>
		</el-table>

		<div class="flex justify-center items-center mt-4">
			<el-pagination
				background
				layout="prev,pager, next"
				:total="total"
				@current-change="getData"
				v-model:current-page="currentPage"
			/>
		</div>
	</el-card>

	<formDrawer ref="formDrawerRef" :title="title" @submit="handleSubmit" size="30%">
		<el-form :model="form" :rules="rules" ref="formRef" label-width="80px" class="w-full">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="form.username" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="form.password" placeholder="密码" />
			</el-form-item>
			<el-form-item label="头像" prop="avatar">
				<chooseImage v-model="form.avatar"></chooseImage>
			</el-form-item>
			<el-form-item label="所属角色" prop="role_id">
				<el-select v-model="form.role_id" placeholder="选择所属角色">
					<el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped></style>

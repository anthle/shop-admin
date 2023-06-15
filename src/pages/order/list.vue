<script setup lang="ts">
import { getOrderList, deleteOrder } from '@/service/main/order'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'
import Search from '@/components/search.vue'
import SearchItem from '@/components/searchItem.vue'

const {
	tableData,
	searchForm,
	loading,
	total,
	currentPage,
	resetSearchForm,
	getData,
	handleDelete,
	multipleTableRef,
	handleMultiDelete,
	handleSelectionChange
} = useInitTable({
	searchForm: {
		tab: 'all',
		no: '',
		starttime: '',
		endtime: '',
		name: '',
		phone: ''
	},
	getList: getOrderList,
	delete: deleteOrder,
	onGetListSuccess: (res: any) => {
		tableData.value = res.data.data.list.map((item: any) => {
			item.bannersLoading = false
			item.contentLoading = false
			item.skusLoading = false
			return item
		})
		total.value = res.data.data.totalCount
	}
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
</script>

<template>
	<el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData()">
		<el-tab-pane :label="item.label" :name="item.name" v-for="item in tabbars" :key="item.label"></el-tab-pane>
	</el-tabs>
	<!-- 搜索 -->
	<el-card shadow="never" class="border-0">
		<Search :model="searchForm" @search="getData()" @reset="resetSearchForm">
			<SearchItem label="订单编号">
				<el-input v-model="searchForm.no" placeholder="订单编号" clearable @keydown.enter="getData()"></el-input>
			</SearchItem>
			<!-- <template #show>
				<SearchItem label="商品分类">
					<el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
						<el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id"> </el-option>
					</el-select>
				</SearchItem>
			</template> -->
		</Search>

		<!-- 新增 -->
		<listHeader layout="">
			<el-popconfirm
				title="是否要删除该商品?"
				confirm-button-text="确定"
				cancel-button-text="取消"
				width="180"
				@confirm="handleMultiDelete"
			>
				<template #reference>
					<el-button type="danger" size="default">批量删除</el-button>
				</template>
			</el-popconfirm>
		</listHeader>

		<!-- 表格 -->
		<el-table
			ref="multipleTableRef"
			:data="tableData"
			stripe
			style="width: 100%"
			table-layout="fixed"
			v-loading="loading"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" />
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
				<template>
					<div v-if="searchForm.tab != 'delete'">
						<el-button class="px-1" type="primary" size="small" text>商品详情</el-button>
					</div>
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
</template>

<style lang="less" scoped></style>

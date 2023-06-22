<script setup lang="ts">
import {
	getGoodsList,
	updateGoodsStatus,
	createGoods,
	updateGoods,
	deleteGoods,
	restoreGoods,
	destroyGoods
} from '@/service/main/goods'
import { getCategoryList } from '@/service/main/category'
import formDrawer from '@/components/formDrawer.vue'
import chooseImage from '@/components/chooseImage.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'
import Search from '@/components/search.vue'
import SearchItem from '@/components/searchItem.vue'
import banners from './c-cnps/banners.vue'
import content from './c-cnps/content.vue'
import skus from './c-cnps/skus.vue'
import { toast } from '@/composables/useEle'

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
	handleSelectionChange,
	handleMultiStatusChange,
	multiSelectionIds
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
			item.bannersLoading = false
			item.contentLoading = false
			item.skusLoading = false
			return item
		})
		total.value = res.data.data.totalCount
	}
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		title: null, //商品名称
		category_id: null, //商品分类
		cover: null, //商品封面
		desc: null, //商品描述
		unit: '件', //商品单位
		stock: 100, //总库存
		min_stock: 10, //库存预警
		status: 1, //是否上架 0仓库1上架
		stock_display: 1, //库存显示 0隐藏1禁用
		min_price: null, //最低销售价
		min_oprice: null //最低原价
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

// 设置轮播图
const bannersRef = ref()
const handleSetGoodsBanners = (row: any) => bannersRef.value.open(row)

// 设置轮播图
const contentRef = ref()
const handleSetGoodsContent = (row: any) => contentRef.value.open(row)

// 设置轮播图
const skusRef = ref()
const handleSetGoodsSkus = (row: any) => skusRef.value.open(row)

// 恢复商品
const handleRestoreGoods = () => useMultiAction(restoreGoods, '恢复')
// 彻底删除商品
const handleDestroyGoods = () => useMultiAction(destroyGoods, '彻底删除')

type FuncType = (param: any) => Promise<any>
function useMultiAction(func: FuncType, msg: string) {
	loading.value = true
	func(multiSelectionIds.value)
		.then(() => {
			toast(msg + '成功!')
			if (multipleTableRef.value) {
				multipleTableRef.value.clearSelection()
			}
			multipleTableRef.value!.clearSelection()
			getData()
		})
		.finally(() => (loading.value = false))
}
</script>

<template>
	<el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData()">
		<el-tab-pane :label="item.label" :name="item.name" v-for="item in tabbars" :key="item.label"></el-tab-pane>
	</el-tabs>
	<!-- 搜索 -->
	<el-card shadow="never" class="border-0">
		<Search :model="searchForm" :length="2" @search="getData()" @reset="resetSearchForm">
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
		<listHeader @create="handleCreate" @refresh="getData()" layout="create,refresh">
			<el-popconfirm
				v-if="searchForm.tab !== 'delete'"
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

			<el-button type="warning" size="default" @click="handleRestoreGoods" v-else>批量恢复</el-button>
			<el-popconfirm
				v-if="searchForm.tab == 'delete'"
				title="是否要彻底删除该商品?"
				confirm-button-text="确定"
				cancel-button-text="取消"
				width="180"
				@confirm="handleDestroyGoods"
			>
				<template #reference>
					<el-button type="danger" size="default">彻底删除</el-button>
				</template>
			</el-popconfirm>

			<el-button
				size="default"
				@click="handleMultiStatusChange(1)"
				v-if="searchForm.tab == 'all' || searchForm.tab == 'off'"
				>上架</el-button
			>
			<el-button
				size="default"
				@click="handleMultiStatusChange(0)"
				v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'"
				>下架</el-button
			>
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
				<template #default="{ row }">
					<div v-if="searchForm.tab != 'delete'">
						<el-button class="px-1" type="primary" size="small" text @click="handleUpdate(row)">修改</el-button>
						<el-button
							class="px-1"
							:type="
								(row.sku_type == 0 && !row.sku_value) || (row.sku_type == 1 && !row.goods_skus.length)
									? 'danger'
									: 'primary'
							"
							size="small"
							text
							@click="handleSetGoodsSkus(row)"
							:loading="row.skusLoading"
							>商品规格</el-button
						>
						<el-button
							:type="row.goods_banner?.length == 0 ? 'danger' : 'primary'"
							class="px-1"
							size="small"
							text
							@click="handleSetGoodsBanners(row)"
							:loading="row.bannersLoading"
							>设置轮播图</el-button
						>
						<el-button
							class="px-1"
							size="small"
							text
							:type="!row.content?.length ? 'danger' : 'primary'"
							@click="handleSetGoodsContent(row)"
							:loading="row.contentLoading"
							>商品详情</el-button
						>
						<el-popconfirm
							title="是否要删除该商品?"
							confirm-button-text="确定"
							cancel-button-text="取消"
							width="180"
							@confirm="handleDelete([row.id])"
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
		<el-form :model="form" :rules="rules" ref="formRef" label-width="90px" class="w-full">
			<el-form-item label="商品名称" prop="title">
				<el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符"></el-input>
			</el-form-item>
			<el-form-item label="封面" prop="cover">
				<chooseImage v-model="form.cover"></chooseImage>
			</el-form-item>
			<el-form-item label="商品分类" prop="category_id">
				<el-select v-model="form.category_id" placeholder="选择所属商品分类">
					<el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="商品描述" prop="desc">
				<el-input v-model="form.desc" type="textarea" placeholder="选填，商品卖点"></el-input>
			</el-form-item>
			<el-form-item label="单位" prop="unit">
				<el-input v-model="form.unit" type="textarea" placeholder="请输入单位" style="width: 50%"></el-input>
			</el-form-item>
			<el-form-item label="总库存" prop="stock">
				<el-input type="number" style="width: 50%" v-model="form.stock">
					<template #append>件</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存预警" prop="min_stock">
				<el-input type="number" style="width: 50%" v-model="form.min_stock">
					<template #append>件</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低销售价" prop="min_price">
				<el-input type="number" v-model="form.min_price" style="width: 50%">
					<template #append>元</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低原价" prop="min_oprice">
				<el-input type="number" v-model="form.min_oprice" style="width: 50%">
					<template #append>元</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存显示" prop="stock_display">
				<el-radio-group v-model="form.stock_display" class="ml-4">
					<el-radio :label="0" size="large">隐藏</el-radio>
					<el-radio :label="1" size="large">显示</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否上架" prop="status">
				<el-radio-group v-model="form.status" class="ml-4">
					<el-radio :label="0" size="large">放入仓库</el-radio>
					<el-radio :label="1" size="large">立即上架</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
	</formDrawer>

	<banners ref="bannersRef" @reloadDate="getData" />
	<content ref="contentRef" @reloadDate="getData" />
	<skus ref="skusRef" @reloadDate="getData" />
</template>

<style lang="less" scoped></style>

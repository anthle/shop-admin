<script setup lang="ts">
import panel from './panel.vue'
import { getAgentList } from '@/service/main/distribution'
import { useInitTable } from '@/composables/useCommon'
import Search from '@/components/search.vue'
import SearchItem from '@/components/searchItem.vue'
import dataDrawer from './dataDrawer.vue'

const { tableData, searchForm, loading, total, currentPage, resetSearchForm, getData } = useInitTable({
	searchForm: {
		keyword: '',
		type: 'all',
		starttime: '',
		endtime: ''
	},
	getList: getAgentList,
	onGetListSuccess: (res: any) => {
		tableData.value = res.data.data.list.map((item: any) => {
			return item
		})
		total.value = res.data.data.totalCount
	}
})

const dataDrawerRef = ref<InstanceType<typeof dataDrawer>>()
const orderDataDrawerRef = ref<InstanceType<typeof dataDrawer>>()

const openDrawer = (id: number, type: string) => {
	if (type === 'user') {
		dataDrawerRef.value?.open(id)
	} else {
		orderDataDrawerRef.value?.open(id)
	}
}
</script>

<template>
	<panel />
	<el-card shadow="never" class="border-0">
		<Search :model="searchForm" :length="4" @search="getData()" @reset="resetSearchForm">
			<SearchItem label="时间选择">
				<el-radio-group v-model="searchForm.type">
					<el-radio-button label="all"> 全部 </el-radio-button>
					<el-radio-button label="today"> 今天 </el-radio-button>
					<el-radio-button label="yesterday"> 昨天 </el-radio-button>
					<el-radio-button label="last7days"> 最近7天 </el-radio-button>
				</el-radio-group>
			</SearchItem>
			<template #show>
				<SearchItem label="开始时间">
					<el-date-picker
						v-model="searchForm.starttime"
						type="date"
						placeholder="开始日期"
						value-format="YYYY-MM-DD"
						style="width: 90%"
					/>
				</SearchItem>
				<SearchItem label="结束时间">
					<el-date-picker
						v-model="searchForm.endtime"
						type="date"
						placeholder="结束日期"
						style="width: 90%"
						value-format="YYYY-MM-DD"
					/>
				</SearchItem>
				<SearchItem label="关键词">
					<el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable></el-input>
				</SearchItem>
			</template>
		</Search>

		<!-- 表格 -->
		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>
			<el-table-column label="头像" width="80">
				<template #default="{ row }">
					<div class="flex items-center">
						<el-avatar :size="40" :src="row.avatar"> </el-avatar>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="用户信息" width="150">
				<template #default="{ row }">
					<div class="text-xs">
						<div>用户:{{ row.username }}</div>
						<div>昵称:{{ row.nickname }}</div>
						<div>姓名:{{ row.user_info.name }}</div>
						<div>用户:{{ row.user_info.phone }}</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="推广用户数量" prop="share_num" align="center"> </el-table-column>
			<el-table-column label="订单数量" prop="share_order_num" align="center"> </el-table-column>
			<el-table-column label="订单金额" prop="order_price" align="center"> </el-table-column>
			<el-table-column label="账户佣金" prop="commission" align="center"> </el-table-column>
			<el-table-column label="已提现金额" prop="cash_out_price" align="center"> </el-table-column>
			<el-table-column label="提现次数" prop="cash_out_time" align="center"> </el-table-column>
			<el-table-column label="未提现金额" prop="no_cash_out_price" align="center"> </el-table-column>

			<el-table-column fixed="right" label="操作" width="180" align="center">
				<template #default="{ row }">
					<div>
						<el-button type="primary" size="small" text @click="openDrawer(row.id, 'user')">推广人</el-button>
						<el-button type="primary" size="small" @click="openDrawer(row.id, 'order')" text>推广订单</el-button>
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
	<dataDrawer ref="dataDrawerRef" />
	<dataDrawer ref="orderDataDrawerRef" type="order" />
</template>
<style lang="less" scoped>
:deep(.el-input__wrapper) {
	width: 100%;
}
</style>

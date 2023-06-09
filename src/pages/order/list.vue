<script setup lang="ts">
import { getOrderList, deleteOrder, refundOrder } from '@/service/main/order'
import { useInitTable } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'
import Search from '@/components/search.vue'
import SearchItem from '@/components/searchItem.vue'
import exportExcel from './c-cnps/exportExcel.vue'
import infoModal from './c-cnps/infoModal.vue'
import { toast, showModal, showPrompt } from '@/composables/useEle'

const {
	tableData,
	searchForm,
	loading,
	total,
	currentPage,
	resetSearchForm,
	getData,
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
		label: '待支付',
		name: 'nopay'
	},
	{
		label: '待发货',
		name: 'noship'
	},
	{
		label: '待收货',
		name: 'shiped'
	},
	{
		label: '已收货',
		name: 'received'
	},
	{
		label: '已关闭',
		name: 'closed'
	},
	{
		label: '退款中',
		name: 'refunding'
	},
	{
		label: '已完成',
		name: 'finish'
	}
]

const exportExcelRef = ref<InstanceType<typeof exportExcel>>()

const openDownload = () => {
	exportExcelRef.value?.open()
}

const infoModalRef = ref<InstanceType<typeof infoModal>>()

const info = ref(null)
const openInfoModal = (row: any) => {
	row.order_items = row.order_items.map((o: any) => {
		if (o.skus_type === 1 && o.goods_skus) {
			let s = []
			for (const k in o.goods_skus.skus) {
				s.push(o.goods_skus.skus[k].value)
			}
			o.sku = s.join(',')
		}
		return o
	})
	info.value = row
	infoModalRef.value?.open()
}

const handleRefund = (id: number, agree: number) => {
	;(agree ? showModal('是否要同意该订单退款?') : showPrompt('请输入拒绝的理由')).then(({ value }) => {
		let data: { agree: number; disagree_reason?: string } = { agree }
		if (!agree) {
			data.disagree_reason = value
		}
		refundOrder(id, data).then(() => {
			getData()
			toast('操作成功')
		})
	})
}
</script>

<template>
	<el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData()">
		<el-tab-pane :label="item.label" :name="item.name" v-for="item in tabbars" :key="item.label"></el-tab-pane>
	</el-tabs>
	<!-- 搜索 -->
	<el-card shadow="never" class="border-0">
		<Search :model="searchForm" :length="5" @search="getData()" @reset="resetSearchForm">
			<SearchItem label="订单编号">
				<el-input v-model="searchForm.no" placeholder="订单编号" clearable @keydown.enter="getData()"></el-input>
			</SearchItem>
			<template #show>
				<SearchItem label="收货人">
					<el-input v-model="searchForm.name" placeholder="收货人" clearable @keydown.enter="getData()"></el-input>
				</SearchItem>
				<SearchItem label="手机号">
					<el-input v-model="searchForm.phone" placeholder="手机号" clearable @keydown.enter="getData()"></el-input>
				</SearchItem>
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
						value-format="YYYY-MM-DD"
						style="width: 90%"
					/>
				</SearchItem>
			</template>
		</Search>

		<!-- 新增 -->
		<listHeader layout="download" @refresh="getData" @download="openDownload">
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
			<el-table-column label="商品" width="300">
				<template #default="{ row }">
					<div class="flex text-sm">
						<div class="flex-1">
							<div>订单号:</div>
							<small>{{ row.no }}</small>
						</div>
						<div class="flex-1">
							<div>下单时间:</div>
							<small>{{ row.create_time }}</small>
						</div>
					</div>
					<div class="flex items-center py-1" v-for="(item, index) in row.order_items" :key="index">
						<el-image
							:src="item.goods_item ? item.goods_item.cover : ''"
							fit="cover"
							:lazy="true"
							style="width: 30px; height: 30px"
						></el-image>
						<p class="text-blue-500 ml-2">
							{{ item.goods_item ? item.goods_item.title : '商品已被删除' }}
						</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="total_price" label="实际付款" align="center" width="120"></el-table-column>
			<el-table-column align="center" label="买家" width="120">
				<template #default="{ row }">
					<p>{{ row.user.nickname || row.user.username }}</p>
					<small>(用户ID:{{ row.user.id }})</small>
				</template>
			</el-table-column>
			<el-table-column label="交易状态" align="center" width="170">
				<template #default="{ row }">
					<div>
						付款状态:
						<el-tag v-if="row.payment_method === 'wechat'" type="success" size="small">微信支付</el-tag>
						<el-tag v-if="row.payment_method === 'alipay'" size="small">支付宝支付</el-tag>
						<el-tag v-else type="info" size="small">未支付</el-tag>
					</div>
					<div>
						发货状态:
						<el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{
							row.ship_data ? '已发货' : '未发货'
						}}</el-tag>
					</div>
					<div>
						收货状态:
						<el-tag :type="row.ship_status === 'received' ? 'success' : 'info'" size="small">{{
							row.ship_data === 'received' ? '已发货' : '未发货'
						}}</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template #default="{ row }">
					<div v-if="searchForm.tab != 'delete'">
						<el-button class="px-1" type="primary" size="small" text @click="openInfoModal(row)">商品详情</el-button>
						<el-button v-if="searchForm.tab === 'noship'" class="px-1" type="primary" size="small" text
							>订单发货</el-button
						>
						<el-button
							v-if="searchForm.tab === 'refunding'"
							class="px-1"
							type="primary"
							size="small"
							text
							@click="handleRefund(row.id, 1)"
							>同意退款</el-button
						>
						<el-button
							v-if="searchForm.tab === 'refunding'"
							class="px-1"
							type="primary"
							size="small"
							text
							@click="handleRefund(row.id, 0)"
							>拒绝退款</el-button
						>
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

	<exportExcel ref="exportExcelRef" :tabs="tabbars"></exportExcel>
	<infoModal ref="infoModalRef" :info="info"></infoModal>
</template>

<style lang="less" scoped></style>

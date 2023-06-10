<script setup lang="ts">
import { useInitTable } from '@/composables/useCommon'
import { getGoodsList } from '@/service/main/goods'

const {
	tableData,
	searchForm,
	loading,
	total,
	currentPage,
	getData,
	multipleTableRef,
	multiSelectionIds,
	handleSelectionChange
} = useInitTable({
	searchForm: {
		title: '',
		tab: 'all',
		category_id: null
	},
	getList: getGoodsList,
	onGetListSuccess: (res: any) => {
		tableData.value = res.data.data.list
		total.value = res.data.data.totalCount
	}
})

const dialogVisible = ref(false)

const close = () => {
	dialogVisible.value = false
}

const callbackFunction = ref()
const open = (callback = null) => {
	callbackFunction.value = callback
	dialogVisible.value = true
}
const submit = () => {
	if (typeof callbackFunction.value === 'function') {
		callbackFunction.value(multiSelectionIds.value)
	}
	close()
}

defineExpose({ open })
</script>

<template>
	<el-dialog title="商品选择" v-model="dialogVisible" width="80%" destroy-on-close>
		<el-table
			ref="multipleTableRef"
			:data="tableData"
			stripe
			style="width: 100%"
			table-layout="fixed"
			v-loading="loading"
			height="500px"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" />
			<el-table-column prop="title" label="商品">
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
							<div class="text-gray-400 text-xs mb-1">分类:{{ row.category ? row.category.name : '未分类' }}</div>
							<span class="text-gray-400 text-xs">创建时间:{{ row.create_time }}</span>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="sale_count" label="总库存" align="center" width="70"></el-table-column>
			<el-table-column prop="sale_count" label="价格(元)" align="center" width="150">
				<template #default="{ row }">
					<span class="text-rose-500">¥{{ row.min_price }}</span>
					<el-divider direction="vertical" content-position="left"></el-divider>
					<span class="text-gray-500 text-xs">¥{{ row.min_oprice }}</span>
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
		<template #footer>
			<span>
				<el-button type="primary" @click="submit()">确认</el-button>
				<el-button @click="close()">取消</el-button>
			</span>
		</template>
	</el-dialog>
</template>

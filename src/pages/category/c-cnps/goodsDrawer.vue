<script setup lang="ts">
import formDrawer from '@/components/formDrawer.vue'
import chooseGoods from '@/components/chooseGoods.vue'
import { toast } from '@/composables/useEle'
import { getCategoryGoods, deleteCategoryGoods, connectCategoryGoods } from '@/service/main/category'

const formDrawerRef = ref<InstanceType<typeof formDrawer>>()

const tableData = ref()
const category_id = ref()

const open = (data: any) => {
	category_id.value = data.id
	data.goodsDrawerLoading = true
	getData()
		.then(() => {
			formDrawerRef.value?.open()
		})
		.finally(() => (data.goodsDrawerLoading = false))
}

async function getData() {
	return getCategoryGoods(category_id.value).then((res) => {
		tableData.value = res.data.data.map((o: any) => {
			o.loading = false
			return o
		})
	})
}

const handleDelete = (row: any) => {
	row.loading = true
	deleteCategoryGoods(row.id)
		.then(() => {
			toast('删除成功!')
			getData()
		})
		.finally(() => (row.loading = false))
}

const chooseGoodsRef = ref<InstanceType<typeof chooseGoods>>()
const handleConnect = () => {
	chooseGoodsRef.value?.open((goods_ids: any) => {
		formDrawerRef.value?.showLoading()
		connectCategoryGoods({
			category_id: category_id.value,
			goods_ids
		})
			.then(() => {
				toast('关联成功!')
				getData()
			})
			.finally(() => {
				formDrawerRef.value?.hideLoading()
			})
	})
}

defineExpose({ open })
</script>

<template>
	<formDrawer ref="formDrawerRef" title="推荐商品" size="40%" confirmText="关联" @submit="handleConnect">
		<el-table :data="tableData" border stripe style="width: 100%">
			<el-table-column prop="goods_id" label="ID" width="60" align="center"></el-table-column>
			<el-table-column label="商品封面" width="180" align="center">
				<template #default="{ row }">
					<el-image :src="row.cover" fit="fill" :lazy="true" style="width: 64px; height: 64px"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="商品名称" width="180" align="center"></el-table-column>
			<el-table-column label="操作" align="center">
				<template #default="{ row }">
					<el-popconfirm
						title="是否要删除该数据?"
						confirm-button-text="确定"
						cancel-button-text="取消"
						width="180"
						@confirm="handleDelete(row)"
					>
						<template #reference>
							<el-button type="primary" size="small" text :loading="row.loading">删除</el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
	</formDrawer>

	<chooseGoods ref="chooseGoodsRef"></chooseGoods>
</template>

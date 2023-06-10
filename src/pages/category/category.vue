<script setup lang="ts">
import listHeader from '@/components/listHeader.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import {
	getCategoryList,
	updateCategoryList,
	createCategoryList,
	updateCategoryStates,
	deleteCategory
} from '@/service/main/category'
import goodsDrawer from './c-cnps/goodsDrawer.vue'

const { tableData, loading, getData, currentPage, handleDelete, handleChangeStatus } = useInitTable({
	getList: getCategoryList,
	onGetListSuccess: (res: any) => {
		tableData.value = res.data.data.map((o: any) => {
			o.goodsDrawerLoading = false
			return o
		})
	},
	delete: deleteCategory,
	updateStatus: updateCategoryStates
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		name: ''
	},
	currentPage,
	rules: {},
	getData,
	update: updateCategoryList,
	create: createCategoryList
})

const goodsDrawerRef = ref<InstanceType<typeof goodsDrawer>>()
const openGoodsDrawer = (data: any) => {
	goodsDrawerRef.value?.open(data)
}
</script>

<template>
	<el-card shadow="never" class="border-0">
		<listHeader @refresh="getData" @create="handleCreate" />
		<el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading" node-key="id">
			<template #default="{ data }">
				<div class="flex flex-1 justify-center items-center text-sm pr-2">
					<span>{{ data.name }}</span>
					<div class="ml-auto">
						<span @click.stop>
							<el-button
								text
								type="primary"
								size="small"
								@click="openGoodsDrawer(data)"
								:loading="data.goodsDrawerLoading"
								>推荐商品</el-button
							>
							<el-switch
								:modelValue="data.status"
								:active-value="1"
								:inactive-value="0"
								@change="handleChangeStatus(data.status, data)"
							></el-switch>
						</span>

						<el-button text type="primary" size="small" @click.stop="handleUpdate(data)">修改</el-button>
						<span @click.stop>
							<el-popconfirm
								title="是否要删除该记录?"
								confirm-button-text="确定"
								cancel-button-text="取消"
								width="180"
								@confirm="handleDelete(data.id)"
							>
								<template #reference>
									<el-button type="primary" size="small" text>删除</el-button>
								</template>
							</el-popconfirm>
						</span>
					</div>
				</div>
			</template>
		</el-tree>
	</el-card>

	<formDrawer ref="formDrawerRef" :title="title" @submit="handleSubmit" size="30%">
		<el-form :model="form" :rules="rules" ref="formRef" label-width="80px" class="w-full">
			<el-form-item label="分类名称" prop="name">
				<el-input v-model="form.name"></el-input>
			</el-form-item>
		</el-form>
	</formDrawer>

	<goodsDrawer ref="goodsDrawerRef"></goodsDrawer>
</template>

<style lang="less" scoped>
:global(.el-tree-node__content) {
	padding: 7px 0;
}
</style>

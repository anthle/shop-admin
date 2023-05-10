<script setup lang="ts">
import { getSkusList, createSkus, updateSkus, deleteSkus, updateSkusStatus } from '@/service/main/skus'
import formDrawer from '@/components/formDrawer.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'
import TagInput from '@/components/tagInput.vue'

const { tableData, loading, total, currentPage, getData, handleDelete, handleChangeStatus } = useInitTable({
	getList: getSkusList,
	delete: deleteSkus,
	updateStatus: updateSkusStatus
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		status: 1,
		name: '',
		order: 50,
		default: '规格1,规格2'
	},
	currentPage,
	rules: {
		name: [{ required: true, message: '该角色名称不能为空', trigger: 'blur' }],
		content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
	},
	getData,
	update: updateSkus,
	create: createSkus
})
</script>

<template>
	<el-card>
		<listHeader @create="handleCreate" @refresh="getData" />

		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column prop="name" label="规格名称" width="180" align="center" />
			<el-table-column prop="default" label="规格值" align="center" />
			<el-table-column prop="order" label="排序" align="center" />
			<el-table-column prop="status" label="状态" width="180" align="center">
				<template #default="{ row }">
					<el-switch
						:modelValue="row.status"
						:active-value="1"
						:inactive-value="0"
						@change="handleChangeStatus($event, row)"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="250" align="center">
				<template #default="scoped">
					<el-button type="primary" size="small" text @click="handleUpdate(scoped.row)">修改</el-button>

					<el-popconfirm
						title="是否要删除该公告?"
						confirm-button-text="确定"
						cancel-button-text="取消"
						width="180"
						@confirm="handleDelete(scoped.row.id)"
					>
						<template #reference>
							<el-button type="primary" size="small" text>删除</el-button>
						</template>
					</el-popconfirm>
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

	<formDrawer ref="formDrawerRef" :title="title" @submit="handleSubmit" destoryClose size="30%">
		<el-form :model="form" :rules="rules" ref="formRef" label-width="80px" class="w-full">
			<el-form-item label="规格名称" prop="name">
				<el-input v-model="form.name" placeholder="角色名称"></el-input>
			</el-form-item>
			<el-form-item label="配许" prop="order">
				<el-input-number v-model="form.order"></el-input-number>
			</el-form-item>

			<el-form-item label="状态" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item label="规格值" prop="default">
				<TagInput v-model="form.default"></TagInput>
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped></style>

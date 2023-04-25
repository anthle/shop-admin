<script setup lang="ts">
import { getRoleList, createRole, updateRole, deleteRole } from '@/service/main/role'
import formDrawer from '@/components/formDrawer.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'

const { tableData, loading, total, currentPage, getData, handleDelete } = useInitTable({
	getList: getRoleList,
	delete: deleteRole
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		name: '',
		status: 1,
		desc: ''
	},
	currentPage,
	rules: {
		name: [{ required: true, message: '该角色名称不能为空', trigger: 'blur' }],
		content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
	},
	getData,
	update: updateRole,
	create: createRole
})
</script>

<template>
	<el-card>
		<listHeader @create="handleCreate" @refresh="getData" />

		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column prop="name" label="角色名称" width="180" align="center" />
			<el-table-column prop="desc" label="角色描述" align="center" />
			<el-table-column prop="status" label="状态" width="180" align="center"
				><span @click.stop>
					<el-switch :modelValue="form.status" :active-value="1" :inactive-value="0"></el-switch>
				</span>
			</el-table-column>
			<el-table-column label="操作" width="180" align="center">
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

	<formDrawer ref="formDrawerRef" :title="title" @submit="handleSubmit" size="30%">
		<el-form :model="form" :rules="rules" ref="formRef" label-width="80px" class="w-full">
			<el-form-item label="角色名称" prop="name">
				<el-input v-model="form.name" placeholder="公告标题"></el-input>
			</el-form-item>
			<el-form-item label="角色描述" prop="desc">
				<el-input v-model="form.desc" placeholder="公告内容" :rows="5" type="textarea" />
			</el-form-item>
			<el-form-item label="角色描述" prop="desc">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped></style>

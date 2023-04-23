<script setup lang="ts">
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '@/service/main/noticeList'
import formDrawer from '@/components/formDrawer.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'

const { tableData, loading, total, currentPage, getData, handleDelete } = useInitTable({
	getList: getNoticeList,
	delete: deleteNotice
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		title: '',
		content: ''
	},
	currentPage,
	rules: {
		title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
		content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
	},
	getData,
	update: updateNotice,
	create: createNotice
})
</script>

<template>
	<el-card>
		<listHeader @create="handleCreate" @refresh="getData" />

		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column prop="title" label="公告标题" width="180" align="center" />
			<el-table-column prop="content" label="公告内容" align="center" />
			<el-table-column prop="create_time" label="发布时间" width="180" align="center" />
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
			<el-form-item label="公告标题" prop="title">
				<el-input v-model="form.title" placeholder="公告标题"></el-input>
			</el-form-item>
			<el-form-item label="公告内容" prop="content">
				<el-input v-model="form.content" placeholder="公告内容" :rows="5" type="textarea" />
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped></style>

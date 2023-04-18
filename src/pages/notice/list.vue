<script setup lang="ts">
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '@/service/main/noticeList'
import formDrawer from '@/components/formDrawer.vue'
import { toast } from '@/composables/useEle'
import type { FormInstance } from 'element-plus'

const tableData = ref([{}])
const loading = ref(false)
const isEdit = ref(false)
const noticeId = ref(0)

// 分页
const total = ref(0)
const currentPage = ref()

// 获取数据
const getData = (page: number = 1) => {
	currentPage.value = page
	loading.value = true
	getNoticeList(currentPage.value)
		.then((res) => {
			tableData.value = res.data.data.list
			total.value = res.data.data.totalCount
		})
		.finally(() => {
			loading.value = false
		})
}

getData()

// 表单

const form = reactive({
	title: '',
	content: ''
})

const rules = {
	title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
	content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}
const formRef = ref<FormInstance>()

const formDrawerRef = ref<InstanceType<typeof formDrawer>>()

const handleSubmit = () => {
	formRef.value?.validate((valid: boolean) => {
		if (!valid) return

		formDrawerRef.value?.showLoading()

		const fun = isEdit.value ? updateNotice(noticeId.value, form) : createNotice(form)

		fun
			.then(() => {
				toast(title.value + '成功')
				getData(isEdit.value ? currentPage.value : 1)
				formDrawerRef.value?.close()
			})
			.finally(() => {
				formDrawerRef.value?.hideLoading()
			})
	})
}

// 新增公告
const handleCreate = () => {
	isEdit.value = false
	formDrawerRef.value?.open()
	form.title = ''
	form.content = ''
}

// 修改公告
const handleUpdateNotice = (row: any) => {
	isEdit.value = true
	formDrawerRef.value?.open()
	form.title = row.title
	form.content = row.content
	noticeId.value = row.id
}

const title = computed(() => {
	return isEdit.value ? '修改' : '新增'
})

// 删除公告

const handleDelete = (id: number) => {
	deleteNotice(id).then(() => {
		toast('删除成功')
		getData(1)
	})
}
</script>

<template>
	<el-card>
		<div class="top mb-4 flex justify-between">
			<el-button type="primary" @click="handleCreate">新增</el-button>
			<el-tooltip class="box-item" effect="dark" content="刷新数据" placement="top">
				<el-button text @click="getData()">
					<el-icon :size="20">
						<Refresh />
					</el-icon>
				</el-button>
			</el-tooltip>
		</div>
		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column prop="title" label="公告标题" width="180" align="center" />
			<el-table-column prop="create_time" label="发布时间" align="center" />
			<el-table-column label="操作" width="180" align="center">
				<template #default="scoped">
					<el-button type="primary" size="small" text @click="handleUpdateNotice(scoped.row)">修改</el-button>

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

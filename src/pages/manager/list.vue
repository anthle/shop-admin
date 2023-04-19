<script setup lang="ts">
import {
	getManagerLilst,
	updateManagerStatus,
	createManager,
	updateManager,
	deleteManager
} from '@/service/main/manager'
import formDrawer from '@/components/formDrawer.vue'
import chooseImage from '@/components/chooseImage.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'

const roles = ref([] as any[])

const {
	tableData,
	serachForm,
	loading,
	total,
	currentPage,
	resetSearchForm,
	getData,
	handleDelete,
	handleChangeStatus
} = useInitTable({
	searchForm: {
		keyword: ''
	},
	getList: getManagerLilst,
	delete: deleteManager,
	updateStatus: updateManagerStatus,
	onGetListSuccess: (res: any) => {
		tableData.value = res.data.data.list.map((item: any) => {
			item.statusLoading = false
			return item
		})
		total.value = res.data.data.totalCount
		roles.value = res.data.data.roles
	}
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdateNotice, title } = useInitForm({
	form: {
		username: '',
		password: '',
		role_id: [] as any[],
		status: 1,
		avatar: ''
	},
	currentPage,
	getData,
	update: updateManager,
	create: createManager
})
</script>

<template>
	<!-- 搜索 -->
	<el-card shadow="never" class="border-0">
		<el-form :model="serachForm" label-width="80" class="mb-3" size="small">
			<el-row :gutter="20">
				<el-col :span="8" :offset="0">
					<el-form-item label="关键词">
						<el-input
							v-model="serachForm.keyword"
							placeholder="管理员昵称"
							clearable
							@keydown.enter="getData()"
						></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8" :offset="8">
					<div class="flex items-center justify-end">
						<el-button type="primary" @click="getData()">搜索</el-button>
						<el-button type="primary" @click="resetSearchForm">重置</el-button>
					</div>
				</el-col>
			</el-row>
		</el-form>

		<!-- 新增 -->
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

		<!-- 表格 -->
		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column prop="title" label="管理员" width="180">
				<template #default="{ row }">
					<div class="flex items-center">
						<el-avatar :size="40" :src="row.avatar">
							<img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
						</el-avatar>
						<div class="ml-3">
							<div class="text-sm font-bold">{{ row.username }}</div>
							<small>ID:{{ row.id }}</small>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="content" label="所属管理员" align="center">
				<template #default="{ row }">
					{{ row.role?.name || '-' }}
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center">
				<template #default="{ row }">
					<el-switch
						:modelValue="row.status"
						:active-value="1"
						:inactive-value="0"
						@change="handleChangeStatus($event, row)"
						:loading="row.statusLoading"
						:disabled="row.id === 3"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template #default="{ row }">
					<span v-if="row.id === 3">无法操作</span>
					<div v-else>
						<el-button type="primary" size="small" text @click="handleUpdateNotice(row)">修改</el-button>
						<el-popconfirm
							title="是否要删除该管理员?"
							confirm-button-text="确定"
							cancel-button-text="取消"
							width="180"
							@confirm="handleDelete(row.id)"
						>
							<template #reference>
								<el-button type="primary" size="small" text>删除</el-button>
							</template>
						</el-popconfirm>
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

	<formDrawer ref="formDrawerRef" :title="title" @submit="handleSubmit" size="30%">
		<el-form :model="form" :rules="rules" ref="formRef" label-width="80px" class="w-full">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="form.username" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="form.password" placeholder="密码" />
			</el-form-item>
			<el-form-item label="头像" prop="avatar">
				<chooseImage v-model="form.avatar"></chooseImage>
			</el-form-item>
			<el-form-item label="所属角色" prop="role_id">
				<el-select v-model="form.role_id" placeholder="选择所属角色">
					<el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped></style>

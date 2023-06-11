<script setup lang="ts">
import { getUserList, updateUserStatus, createUser, updateUser, deleteUser } from '@/service/main/user'
import formDrawer from '@/components/formDrawer.vue'
import chooseImage from '@/components/chooseImage.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'
import Search from '@/components/search.vue'
import SearchItem from '@/components/searchItem.vue'

const roles = ref([] as any[])

const user_level = ref([] as any[])

const {
	tableData,
	searchForm,
	loading,
	total,
	currentPage,
	resetSearchForm,
	getData,
	handleDelete,
	handleChangeStatus
} = useInitTable({
	searchForm: {
		keyword: '',
		user_level_id: null
	},
	getList: getUserList,
	delete: deleteUser,
	updateStatus: updateUserStatus,
	onGetListSuccess: (res: any) => {
		tableData.value = res.data.data.list.map((item: any) => {
			item.statusLoading = false
			return item
		})
		total.value = res.data.data.totalCount
		user_level.value = res.data.data.user_level
	}
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		username: '',
		password: '',
		role_id: [] as any[],
		status: 1,
		nickname: '',
		phone: '',
		email: '',
		avatar: '',
		user_level_id: null
	},
	currentPage,
	getData,
	update: updateUser,
	create: createUser
})
</script>

<template>
	<!-- 搜索 -->
	<el-card shadow="never" class="border-0">
		<Search :model="searchForm" @search="getData()" @reset="resetSearchForm">
			<SearchItem label="关键词">
				<el-input
					v-model="searchForm.keyword"
					placeholder="手机号/邮箱/会员昵称"
					clearable
					@keydown.enter="getData()"
				></el-input>
			</SearchItem>
			<template #show>
				<SearchItem label="会员等级">
					<el-select v-model="searchForm.user_level_id" placeholder="请选择会员等级" clearable>
						<el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id"> </el-option>
					</el-select>
				</SearchItem>
			</template>
		</Search>

		<!-- 新增 -->
		<listHeader @create="handleCreate" @refresh="getData()"></listHeader>

		<!-- 表格 -->
		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column label="会员" width="180">
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
			<el-table-column label="会员等级" align="center">
				<template #default="{ row }">
					{{ row.user_level?.name || '-' }}
				</template>
			</el-table-column>
			<el-table-column label="登录注册" align="center">
				<template #default="{ row }">
					<p>注册时间 : {{ row.create_time }}</p>
					<p v-if="row.last_login_time">最后登录时间 : {{ row.last_login_time }}</p>
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
						<el-button type="primary" size="small" text @click="handleUpdate(row)">修改</el-button>
						<el-popconfirm
							title="是否要删除该用户?"
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
			<el-form-item label="昵称" prop="nickname">
				<el-input v-model="form.nickname" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item label="头像" prop="avatar">
				<chooseImage v-model="form.avatar"></chooseImage>
			</el-form-item>
			<el-form-item label="会员等级" prop="user_level_id">
				<el-select v-model="form.user_level_id" placeholder="选择会员等级">
					<el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item label="手机" prop="phone">
				<el-input v-model="form.phone" placeholder="手机"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="form.email" placeholder="邮箱"></el-input>
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped></style>

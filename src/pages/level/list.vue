<script setup lang="ts">
import {
	getUserLevelList,
	createUserLevel,
	updateUserLevel,
	deleteUserLevel,
	updateUserLevelStatus
} from '@/service/main/level'
import formDrawer from '@/components/formDrawer.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'

const { tableData, loading, total, currentPage, getData, handleDelete, handleChangeStatus } = useInitTable({
	getList: getUserLevelList,
	delete: deleteUserLevel,
	updateStatus: updateUserLevelStatus
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		name: '',
		level: 100,
		discount: 0,
		max_price: 0,
		max_times: 0,
		status: 0
	},
	currentPage,
	rules: {
		name: [{ required: true, message: '会员等级名称不能为空', trigger: 'blur' }],
		content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
	},
	getData,
	update: updateUserLevel,
	create: createUserLevel
})
</script>

<template>
	<el-card>
		<listHeader @create="handleCreate" @refresh="getData" />

		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column prop="name" label="会员等级" width="180" align="center" />
			<el-table-column prop="discount" label="折扣率" align="center" />
			<el-table-column prop="level" label="等级序号" align="center" />
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
						title="是否要删除该等级?"
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
			<el-form-item label="等级名称" prop="name">
				<el-input v-model="form.name" placeholder="等级名称"></el-input>
			</el-form-item>
			<el-form-item label="等级权重" prop="level">
				<el-input type="number" v-model="form.desc" placeholder="等级权重" :rows="5" />
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item label="升级条件" prop="level">
				<div>
					<small class="text-xs mr-2">累计消费满</small>
					<el-input type="number" v-model="form.max_price" placeholder="累计消费" style="width: 50%">
						<template #append>元</template>
					</el-input>
					<small class="text-gray-400 flex">设置会员等级所需要的累计消费必须大于等于0，单位:元</small>
				</div>
				<div>
					<small class="text-xs mr-2">累计次数满</small>
					<el-input type="number" v-model="form.max_times" placeholder="累计次数" style="width: 50%">
						<template #append>%</template>
						<small class="text-gary-400 flex"
							>折扣率单位为百分比，如输入90，表示该会员等级的用户可以以原价的90%购买</small
						>
					</el-input>
				</div>
			</el-form-item>
			<el-form-item label="折扣率(%)" prop="discount">
				<el-input type="number" v-model="form.discount" placeholder="折扣率(%)" style="width: 50%">
					<template #append>%</template>
				</el-input>
				<small class="text-gray-400 flex">折扣率单位为百分比，如输入90，表示该会员等级的用户可以以原价的90%购买</small>
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped></style>

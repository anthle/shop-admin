<script setup lang="ts">
import { getRoleList, createRole, updateRole, deleteRole, updateRoleStatus, setRoleRules } from '@/service/main/role'
import { getRuleList } from '@/service/main/rule'
import formDrawer from '@/components/formDrawer.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'
import { toast } from '@/composables/useEle'

const { tableData, loading, total, currentPage, getData, handleDelete, handleChangeStatus } = useInitTable({
	getList: getRoleList,
	delete: deleteRole,
	updateStatus: updateRoleStatus
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		name: '',
		status: 0,
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

const setRuleFormDrawerRef = ref<InstanceType<typeof formDrawer>>()
const treeRef = ref()
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
// 当前角色拥有的权限
const roleIds = ref([] as any[])
const defaultExpandedKeys = ref([])
const defaultCheckedKeys = ref([])
const checkStrickly = ref(false)
const handleSetRuleSubmit = () => {
	setRuleFormDrawerRef.value?.showLoading()
	setRoleRules(roleId.value, roleIds.value)
		.then(() => {
			toast('配置成功')
			getData()
			setRuleFormDrawerRef.value?.close()
		})
		.finally(() => {
			setRuleFormDrawerRef.value?.hideLoading()
		})
}

const openSetRule = (row: any) => {
	roleId.value = row.id
	setRuleFormDrawerRef.value?.open()
	treeHeight.value = window.innerHeight - 170
	checkStrickly.value = true
	getRuleList(1).then((res) => {
		defaultExpandedKeys.value = res.data.data.list.map((item: any) => item.id)
		defaultCheckedKeys.value = row.rules.map((item: any) => item.id)
		ruleList.value = res.data.data.list

		setTimeout(() => {
			treeRef.value.setCheckedKeys(defaultCheckedKeys.value)
			checkStrickly.value = false
		}, 150)
	})
}

const handleCheck = (...event: any) => {
	const { checkedKeys, halfCheckedKeys } = event[1]
	roleIds.value = [...checkedKeys, ...halfCheckedKeys]
}
</script>

<template>
	<el-card>
		<listHeader @create="handleCreate" @refresh="getData" />

		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column prop="name" label="角色名称" width="180" align="center" />
			<el-table-column prop="desc" label="角色描述" align="center" />
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
					<el-button type="primary" size="small" text @click="openSetRule(scoped.row)">配置权限</el-button>
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
				<el-input v-model="form.name" placeholder="角色名称"></el-input>
			</el-form-item>
			<el-form-item label="角色描述" prop="desc">
				<el-input v-model="form.desc" placeholder="角色描述" :rows="5" type="textarea" />
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
		</el-form>
	</formDrawer>

	<!-- 修改权限 -->
	<formDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
		<el-tree
			ref="treeRef"
			:default-expanded-keys="defaultExpandedKeys"
			:check-strictly="checkStrickly"
			node-key="id"
			:data="ruleList"
			:props="{ label: 'name', children: 'child' }"
			show-checkbox
			:height="treeHeight"
			@check="handleCheck"
		>
			<template #default="{ data }">
				<div class="flex items-center">
					<el-tag :type="data.menu ? '' : 'info'" size="small">
						{{ data.menu ? '菜单' : '权限' }}
					</el-tag>
					<span class="ml-2 text-sm">{{ data.name }}</span>
				</div>
			</template>
		</el-tree>
	</formDrawer>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
import listHeader from '@/components/listHeader.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import { getRuleList, updateRuleList, createRuleList, updateRuleStates, deleteRule } from '@/service/main/rule'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const defalutExpandedKeys = ref([])
const options = ref([])
const { tableData, loading, getData, currentPage, handleDelete, handleChangeStatus } = useInitTable({
	getList: getRuleList,
	onGetListSuccess: (res: any) => {
		tableData.value = res.data.data.list
		defalutExpandedKeys.value = res.data.data.list.map((item: any) => item.id)
		options.value = res.data.data.rules
	},
	delete: deleteRule,
	updateStatus: updateRuleStates
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		rule_id: 0,
		menu: 0,
		name: '',
		condition: '',
		method: 'GET',
		status: 1,
		order: 50,
		icon: '',
		frontpath: ''
	},
	currentPage,
	rules: {},
	getData,
	update: updateRuleList,
	create: createRuleList
})

const icons = ref(Object.keys(ElementPlusIconsVue))

// 增加子分类
const addChild = (id: number) => {
	handleCreate()
	form.rule_id = id
	form.status = 1
}
</script>

<template>
	<el-card shadow="never" class="border-0">
		<listHeader @refresh="getData" @create="handleCreate" />
		<el-tree
			:data="tableData"
			:props="{ label: 'name', children: 'child' }"
			v-loading="loading"
			node-key="id"
			:default-expanded-keys="defalutExpandedKeys"
		>
			<template #default="{ data }">
				<div class="flex flex-1 justify-center items-center text-sm pr-2">
					<el-tag size="small" :type="data.menu ? '' : 'info'">{{ data.menu ? '菜单' : '权限' }}</el-tag>
					<el-icon v-if="data.icon" :size="16" class="ml-2">
						<component :is="data.icon"></component>
					</el-icon>
					<span>{{ data.name }}</span>
					<div class="ml-auto">
						<span @click.stop>
							<el-switch
								:modelValue="data.status"
								:active-value="1"
								:inactive-value="0"
								@change="handleChangeStatus(data.status, data)"
							></el-switch>
						</span>

						<el-button text type="primary" size="small" @click.stop="handleUpdate(data)">修改</el-button>
						<el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
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
			<el-form-item label="上级菜单" prop="rule_id">
				<el-cascader
					v-model="form.rule_id"
					:options="options"
					:props="{ label: 'name', value: 'id', children: 'child', checkStrictly: true, emitPath: false }"
					clearable
					placeholder="请选择上级菜单"
				/>
			</el-form-item>
			<el-form-item label="菜单/规则" prop="menu">
				<el-radio-group v-model="form.menu">
					<el-radio :label="1" size="large" border>菜单</el-radio>
					<el-radio :label="0" size="large" border>规则</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="名称" prop="name">
				<el-input v-model="form.name" placeholder="名称" style="width: 30%"></el-input>
			</el-form-item>
			<el-form-item label="菜单图标" prop="icon" v-if="form.menu === 1">
				<div class="flex items-center">
					<el-icon v-if="form.icon" :size="20" class="mr-2">
						<component :is="form.icon"></component>
					</el-icon>
					<el-select v-model="form.icon" placeholder="请选择图标" filterable>
						<el-option v-for="item in icons" :key="item" :label="item" :value="item">
							<div class="flex items-center justify-between">
								<el-icon>
									<component :is="item"></component>
								</el-icon>
								<span class="text-gray-500">{{ item }}</span>
							</div>
						</el-option>
					</el-select>
				</div>
			</el-form-item>
			<el-form-item label="前端路由" prop="frontpath" v-if="form.menu === 1 && form.rule_id > 0">
				<el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
			</el-form-item>
			<el-form-item label="后端规则" prop="frontpath" v-if="form.menu === 0">
				<el-input v-model="form.condition" placeholder="后端规则"></el-input>
			</el-form-item>
			<el-form-item label="请求方式" prop="method" v-if="form.menu === 0">
				<el-select v-model="form.method" class="m-2" placeholder="请选择请求方式" size="large">
					<el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item" :value="item" />
				</el-select>
			</el-form-item>
			<el-form-item label="排序" prop="order">
				<el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped>
:global(.el-tree-node__content) {
	padding: 7px 0;
}
</style>

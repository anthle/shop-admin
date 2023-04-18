<script setup lang="ts">
import asideList from './asideList.vue'
import { getImageList } from '@/service/main/imageList'
import formDrawer from '@/components/formDrawer.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { createImageClass, updateImageClass, deleteImageClass } from '@/service/main/imageList'
import { toast } from '@/composables/useEle'

const list = ref([] as any[])
const active = ref(0)
const isEdit = ref(false)
const loading = ref(false)

// 分页
const total = ref(0)
const currentPage = ref()

// 获取数据
const getData = (page: number = 1) => {
	currentPage.value = page
	loading.value = true
	getImageList(currentPage.value)
		.then((res) => {
			list.value = res.data.data.list
			total.value = res.data.data.totalCount
			let item = list.value[0]

			if (item) {
				handdleListItemClick(item.id)
			}
		})
		.finally(() => {
			loading.value = false
		})
}

getData()

// 新增分类
const formDrawerRef = ref()

const form = reactive({
	name: '',
	order: 1
})

const formRef = ref<FormInstance>()

const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
})

const handleSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formDrawerRef.value.showLoading()
	formEl.validate((valid: boolean) => {
		if (valid) {
			const fun = isEdit.value ? updateImageClass(itemId.value, form) : createImageClass(form)
			fun
				.then(() => {
					toast(title.value + '成功')
					formDrawerRef.value.close()
					getData(isEdit.value ? currentPage.value : 1)
				})
				.finally(() => {
					formDrawerRef.value.hideLoading()
				})
		} else {
			formDrawerRef.value.hideLoading()
		}
	})
}

const handleAdd = () => {
	isEdit.value = false
	formDrawerRef.value.open()
	form.name = ''
	form.order = 1
}

// 编辑分类

const title = computed(() => {
	return isEdit.value ? '编辑' : '新增'
})

const itemId = ref(null)

const handleEdit = (item: any) => {
	formDrawerRef.value.open()
	isEdit.value = true
	form.name = item.name
	form.order = item.order
	itemId.value = item.id
}

// 删除分类

const handleDelete = (itemId: number) => {
	loading.value = true
	isEdit.value = false
	deleteImageClass(itemId)
		.then(() => {
			toast('删除成功')
			getData(currentPage.value)
		})
		.finally(() => {
			loading.value = false
		})
}

// 侧边栏点击事件
const emit = defineEmits(['change'])
const handdleListItemClick = (id: any) => {
	active.value = id
	emit('change', id)
}

defineExpose({
	handleAdd,
	form
})
</script>
<template>
	<el-aside width="220px" class="img-aside" v-loading="loading">
		<div class="top">
			<asideList
				v-for="item in list"
				:key="item.id"
				:title="item.name"
				:active="item.id === active"
				@edit="handleEdit(item)"
				@close="handleDelete(item.id)"
				@click="handdleListItemClick(item.id)"
			></asideList>
		</div>
		<div class="bottom">
			<el-pagination background layout="prev, next" :total="total" @current-change="getData" />
		</div>
	</el-aside>

	<formDrawer ref="formDrawerRef" :title="title" @submit="handleSubmit(formRef)">
		<el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
			<el-form-item label="分类名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="order">
				<el-input-number v-model="form.order" :min="0" :max="1000" />
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped>
.img-aside {
	border-right: 1px solid #eeeeee;
	position: relative;
}
.img-aside .top {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 50px;
	overflow-y: auto;
}
.img-aside .bottom {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 50px;
	@apply flex justify-center items-center;
}
.aside-list {
	border-bottom: 1px solid #eeeeee;
	@apply flex  items-center p-3 text-sm text-gray-500;
}
.aside-list:hover,
.active {
	@apply bg-blue-50;
}
</style>

<script setup lang="ts">
import { useInitTable } from '@/composables/useCommon'
import { getSkusList } from '@/service/main/skus'

const dialogVisible = ref(false)
const activeId = ref(0)
const { tableData, loading, total, currentPage, getData } = useInitTable({
	getList: getSkusList,
	onGetListSuccess: (res) => {
		tableData.value = res.data.data.list
		total.value = res.data.data.totalCount

		if (tableData.value.length > 0) {
			handleChangeActiveId(tableData.value[0].id)
		}
	}
})
const form = reactive({
	name: '',
	list: []
})

const list = ref([])
const handleChangeActiveId = (id: number) => {
	activeId.value = id
	list.value = []
	let item = tableData.value.find((o: any) => o.id == id)
	if (item) {
		list.value = item.default.split(',')
		form.name = item.name
	}
}

const callbackFunction = ref() as any
const open = (callback: any = null) => {
	callbackFunction.value = callback
	getData(1)
	dialogVisible.value = true
}
const submit = () => {
	if (typeof callbackFunction.value === 'function') {
		callbackFunction.value(form)
	}
	dialogVisible.value = false
}
defineExpose({ open })
</script>

<template>
	<el-dialog title="规格选择" v-model="dialogVisible" width="80%">
		<el-container style="height: 65vh">
			<el-aside width="220px" class="img-aside">
				<div class="top">
					<div
						class="sku-list"
						:class="{ active: activeId == item.id }"
						v-for="item in tableData"
						:key="item.id"
						@click="handleChangeActiveId(item.id)"
					>
						{{ item.name }}
					</div>
				</div>
				<div class="bottom">
					<el-pagination
						background
						layout="prev, next"
						:total="total"
						@current-change="getData"
						v-model:current-page="currentPage"
					/>
				</div>
			</el-aside>
			<el-main>
				<el-checkbox-group v-model="form.list">
					<el-checkbox v-for="(item, index) in list" :key="index" :label="item" border>
						{{ item }}
					</el-checkbox>
				</el-checkbox-group>
			</el-main>
		</el-container>
		<template #footer>
			<span>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submit">确认</el-button>
			</span>
		</template>
	</el-dialog>
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
.sku-list {
	border-bottom: 0.0625rem solid #f4f4f4;
	@apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}
.sku-list:hover,
.active {
	@apply bg-blue-50;
}
</style>

<script setup lang="ts">
import { getNoticeList } from '@/service/main/noticeList'

const tableData = ref([{}])
const loading = ref(false)

// 分页
const total = ref(0)
const currentPage = ref()

// 获取数据
const getData = (page: number = 1) => {
	currentPage.value = page
	loading.value = true
	getNoticeList(currentPage.value)
		.then((res) => {
			console.log(res)
			tableData.value = res.data.data.list
			total.value = res.data.data.totalCount
		})
		.finally(() => {
			loading.value = false
		})
}

getData()

const handleDelete = (id: number) => {
	console.log(id)
}
</script>

<template>
	<el-card>
		<div class="top mb-4 flex justify-between">
			<el-button type="primary">新增</el-button>
			<el-tooltip class="box-item" effect="dark" content="刷新数据" placement="top">
				<el-button text @click="getData()">
					<el-icon :size="20">
						<Refresh />
					</el-icon>
				</el-button>
			</el-tooltip>
		</div>
		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column prop="title" label="公告标题" width="180" />
			<el-table-column prop="create_time" label="发布时间" align="center" />
			<el-table-column label="操作" width="180" align="center">
				<template #default="scoped">
					<el-button type="primary" size="small" text>修改</el-button>

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
			<el-pagination background layout="prev,pager, next" :total="total" @current-change="getData" />
		</div>
	</el-card>
</template>

<style lang="less" scoped></style>

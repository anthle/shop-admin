<script setup lang="ts">
import { getGoodsCommentList, updateGoodsCommentStatus, reviewGoodsComment } from '@/service/main/goods_comment'
import { useInitTable } from '@/composables/useCommon'
import Search from '@/components/search.vue'
import SearchItem from '@/components/searchItem.vue'
import { toast } from '@/composables/useEle'

const roles = ref([] as any[])

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
		title: ''
	},
	getList: getGoodsCommentList,
	updateStatus: updateGoodsCommentStatus,
	onGetListSuccess: (res: any) => {
		tableData.value = res.data.data.list.map((item: any) => {
			item.statusLoading = false
			item.textareaEdit = false
			return item
		})
		total.value = res.data.data.totalCount
		roles.value = res.data.data.roles
	}
})

const textarea = ref('')

const openTextare = (row: any, data = '') => {
	textarea.value = data
	row.textareaEdit = true
}

const review = (row: any) => {
	if (textarea.value == '') {
		return toast('回复内容不能为空', 'error')
	}
	reviewGoodsComment(row.id, textarea.value).then((res) => {
		row.textareaEdit = false
		toast('回复成功')
		getData()
	})
}
</script>

<template>
	<!-- 搜索 -->
	<el-card shadow="never" class="border-0">
		<Search :model="searchForm" @search="getData()" @reset="resetSearchForm">
			<SearchItem label="关键词">
				<el-input v-model="searchForm.title" placeholder="商品标题" clearable @keydown.enter="getData()"></el-input>
			</SearchItem>
		</Search>

		<!-- 表格 -->
		<el-table default-expand-all :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column type="expand">
				<template #default="{ row }">
					<div class="flex pl-16">
						<el-avatar :size="50" :src="row.user.avatar" fit="fill" class="mr-3"></el-avatar>
						<div class="flex-1">
							<h6 class="flex items-center">
								{{ row.user.nickname || row.user.username }}
								<small class="text-gray-400 ml-2">{{ row.review_time }}</small>
								<el-button size="small" class="ml-auto" @click="openTextare(row)" v-if="!row.textareaEdit && !row.extra"
									>回复</el-button
								>
							</h6>
							{{ row.review.data }}
							<div class="py-2">
								<el-image
									v-for="(item, index) in row.review.image"
									:key="index"
									:src="item"
									fit="fill"
									:lazy="true"
									style="width: 100px; height: 100px"
									class="rounded"
								></el-image>
							</div>

							<div v-if="row.textareaEdit">
								<el-input v-model="textarea" placeholder="请输入评价内容" type="textarea" :row="2"></el-input>
								<div class="py-2">
									<el-button type="primary" size="small" @click="review(row)">回复</el-button>
									<el-button size="small" class="ml-2" @click="row.textareaEdit = false">取消</el-button>
								</div>
							</div>

							<template v-else>
								<div class="mt-3 bg-gray-200 p-3 rounded" v-for="(item, index) in row.extra" :key="index">
									<h6 class="flex font-bold">
										客服
										<el-button type="info" size="small" class="ml-auto" @click="openTextare(row, item.data)"
											>修改</el-button
										>
									</h6>
									<p>{{ item.data }}</p>
								</div>
							</template>
						</div>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="id" label="ID" align="center" width="70"></el-table-column>
			<el-table-column prop="title" label="商品" width="180">
				<template #default="{ row }">
					<div class="flex items-center">
						<el-image
							:src="row.goods_item ? row.goods_item.cover : ''"
							fit="fill"
							:lazy="true"
							style="width: 50px; height: 50px"
						></el-image>

						<div class="ml-3">
							<h6>{{ row.goods_item?.title ?? '商品已被删除' }}</h6>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="content" label="评价信息" align="center">
				<template #default="{ row }">
					<div>
						<p>用户:{{ row.user.nickname || row.user.username }}</p>
						<p>
							<el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
						</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="review_time" label="评价时间" align="center"></el-table-column>
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
</template>

<style lang="less" scoped></style>

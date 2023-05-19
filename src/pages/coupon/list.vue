<script setup lang="ts">
import { getCoupon, createCoupon, updateCoupon, deleteCoupon, updateCouponStatus } from '@/service/main/coupon'
import formDrawer from '@/components/formDrawer.vue'
import { useInitTable, useInitForm } from '@/composables/useCommon'
import listHeader from '@/components/listHeader.vue'
import type { Row } from './types'

function formatStatus(row: Row) {
	let s = '领取中'
	let start_time = new Date(row.start_time).getTime()
	let end_time = new Date(row.end_time).getTime()
	let now_time = new Date().getTime()

	if (start_time > now_time) {
		s = '未开始'
	} else if (end_time < now_time) {
		s = '已结束'
	} else if (row.status === 0) {
		s = '已失效'
	}
	return s
}

const { tableData, loading, total, currentPage, getData, handleDelete, handleChangeStatus } = useInitTable({
	getList: getCoupon,
	delete: deleteCoupon,
	updateStatus: updateCouponStatus,
	onGetListSuccess: (res) => {
		tableData.value = res.data.data.list.map((o: any) => {
			o.statusText = formatStatus(o)
			return o
		})
		total.value = res.data.data.totalCount
	}
})

const { form, rules, formRef, formDrawerRef, handleSubmit, handleCreate, handleUpdate, title } = useInitForm({
	form: {
		name: '',
		type: 0,
		value: 0,
		total: 100,
		min_price: 0,
		start_time: null,
		end_time: null,
		order: 50,
		desc: ''
	},
	currentPage,
	getData,
	update: updateCoupon,
	create: createCoupon,
	beforeSubmit: (res) => {
		if (typeof res.start_time != 'number') {
			res.start_time = new Date(res.start_time).getTime()
		}
		if (typeof res.end_time != 'number') {
			res.end_time = new Date(res.end_time).getTime()
		}
		return res
	}
})

const timerange: any = computed({
	get: () => {
		return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
	},
	set: (value) => {
		form.start_time = value[0]
		form.end_time = value[1]
	}
})
</script>

<template>
	<el-card>
		<listHeader @create="handleCreate" @refresh="getData" />

		<el-table :data="tableData" stripe style="width: 100%" table-layout="fixed" v-loading="loading">
			<el-table-column label="优惠券名称" width="350" align="center">
				<template #default="{ row }">
					<div
						class="border border-dashed py-2 px-4 rounded"
						:class="row.statusText == '领取中' ? 'active' : 'inactive'"
					>
						<div class="font-bold text-lg">{{ row.name }}</div>
						<small>{{ row.start_time }} ~ {{ row.end_time }}</small>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="statusText" label="状态" align="center" width="150" />
			<el-table-column prop="content" label="优惠" align="center">
				<template #default="{ row }">
					{{ row.type === 0 ? '满减' : '折扣' }} {{ row.type === 0 ? '¥' + row.value : row.value + '折' }}
				</template>
			</el-table-column>
			<el-table-column prop="total" label="发放数量" align="center" />
			<el-table-column prop="used" label="已使用数量" align="center" />
			<el-table-column label="操作" width="180" align="center">
				<template #default="scoped">
					<el-button
						v-if="scoped.row.statusText === '未开始'"
						type="primary"
						size="small"
						text
						@click="handleUpdate(scoped.row)"
						>修改</el-button
					>

					<el-popconfirm
						v-if="scoped.row.statusText != '领取中'"
						title="是否要删除该优惠券?"
						confirm-button-text="确定"
						cancel-button-text="取消"
						width="180"
						@confirm="handleDelete(scoped.row.id)"
					>
						<template #reference>
							<el-button type="primary" size="small" text>删除</el-button>
						</template>
					</el-popconfirm>

					<el-popconfirm
						v-if="scoped.row.statusText === '领取中'"
						title="是否要让该优惠券失效?"
						confirm-button-text="确定"
						cancel-button-text="取消"
						width="180"
						@confirm="handleChangeStatus(0, scoped.row)"
					>
						<template #reference>
							<el-button type="danger" size="small">失效</el-button>
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
		<el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="w-full">
			<el-form-item label="优惠券名称" prop="name">
				<el-input v-model="form.name" placeholder="优惠券名称"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-radio-group v-model="form.type">
					<el-radio :label="0">满减</el-radio>
					<el-radio :label="1">折扣</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="面值" prop="value">
				<el-input v-model="form.value" placeholder="面值" style="width: 50%">
					<template #append>{{ form.type === 0 ? '元' : '折' }}</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低使用价格" prop="min_price">
				<el-input v-model="form.min_price" placeholder="最低使用价格" style="width: 50%">
					<template #append>{{ form.type === 0 ? '元' : '折' }}</template>
				</el-input>
			</el-form-item>
			<el-form-item label="发行量" prop="total">
				<el-input-number v-model="form.total" :min="0" :max="10000" />
			</el-form-item>
			<el-form-item label="排序" prop="order">
				<el-input-number v-model="form.order" :min="0" :max="1000" />
			</el-form-item>
			<el-form-item label="活动时间" prop="content">
				<el-date-picker
					v-model="timerange"
					type="datetimerange"
					range-separator="To"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="YYYY-MM-DD HH:mm:ss"
					:editable="false"
				/>
			</el-form-item>
			<el-form-item label="描述" prop="desc">
				<el-input v-model="form.desc" placeholder="描述" :rows="5" type="textarea" />
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

<style lang="less" scoped>
.active {
	@apply border-rose-200 bg-rose-50 text-red-400;
}
.inactive {
	@apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>

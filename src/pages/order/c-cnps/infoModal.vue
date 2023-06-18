<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

interface Props {
	info: any
}
const props = defineProps<Props>()

const dialogVisible = ref(false)

const open = () => (dialogVisible.value = true)
const close = () => (dialogVisible.value = false)

const ship_time = computed(() => {
	if (props.info.ship_data.express_time) {
		const s = useDateFormat(props.info.ship_data.express_time * 1000, 'YYYY-MM-DD HH:mm:ss')
		return s.value
	}
	return ''
})

const refund_status = computed(() => {
	const opt = {
		pending: '未退款',
		applied: '已申请,等待审核',
		processing: '退款中',
		success: '退款成功',
		failed: '退款失败'
	}
	// return props.info.refund_status ? opt[props.info.refund_status] : []
})

defineExpose({
	open
})
</script>

<template>
	<el-drawer title="订单详情" v-model="dialogVisible" direction="rtl" size="30%">
		<el-card shadow="never" class="mb-3">
			<template #header>
				<b class="text-sm">订单详情</b>
			</template>
			<el-form label-width="80px">
				<el-form-item label="订单号">{{ info.no }} </el-form-item>
				<el-form-item label="付款方式">{{ info.payment_method }} </el-form-item>
				<el-form-item label="付款时间">{{ info.paid_time }} </el-form-item>
				<el-form-item label="创建时间">{{ info.create_time }} </el-form-item>
			</el-form>
		</el-card>

		<el-card v-if="info.ship_data" shadow="never" class="mb-3">
			<template #header>
				<b class="text-sm">发货信息</b>
			</template>
			<el-form label-width="80px">
				<el-form-item label="物流公司">{{ info.ship_data.express_company }} </el-form-item>
				<el-form-item label="运单号">{{ info.ship_data.express_no }} </el-form-item>
				<el-form-item label="发货时间">{{ ship_time }} </el-form-item>
			</el-form>
		</el-card>

		<el-card shadow="never" class="mb-3">
			<template #header>
				<b class="text-sm">商品信息</b>
			</template>
			<div class="flex mb-2" v-for="(item, index) in info.order_items" :key="index">
				<el-image
					:src="item.goods_item?.cover ?? ''"
					fit="fill"
					:lazy="true"
					style="width: 60px; height: 60px"
				></el-image>
				<div class="ml-2 text-sm">
					<p>{{ item.goods_item?.title ?? '商品已被删除' }}</p>
					<p v-if="item.sku" class="mt-1">
						<el-tag type="info" size="small">{{ item.sku }} </el-tag>
					</p>
					<p class="text-rose-500 font-bold mr-2">
						¥{{ item.price }}
						<span class="text-xs text-gray-500 ml-2">X{{ item.num }}</span>
					</p>
				</div>
			</div>
			<el-form label-width="80px">
				<el-form-item label="成交价">
					<span class="text-rose-500 font-bold">¥{{ info.total_price }}</span>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card shadow="never" v-if="info.address">
			<template #header>
				<b class="text-sm">收货信息</b>
			</template>
			<el-form label-width="80px">
				<el-form-item label="收款人">{{ info.address.name }} </el-form-item>
				<el-form-item label="联系方式">{{ info.address.phone }} </el-form-item>
				<el-form-item label="联系地址"
					>{{ info.address.province + info.address.city + info.address.district + info.address.address }}
				</el-form-item>
			</el-form>
		</el-card>

		<el-card shadow="never" v-if="info.refund_status !== 'pending'">
			<template #header>
				<b class="text-sm">退款信息</b>
				<el-button text disabled></el-button>
			</template>
			<el-form label-width="80px">
				<el-form-item label="收款人">{{ info.address.name }} </el-form-item>
				<el-form-item label="联系方式">{{ info.address.phone }} </el-form-item>
				<el-form-item label="联系地址"
					>{{ info.address.province + info.address.city + info.address.district + info.address.address }}
				</el-form-item>
			</el-form>
		</el-card>
	</el-drawer>
</template>

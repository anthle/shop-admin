<script setup lang="ts">
import { toast } from '@/composables/useEle'
import { readGoods, updateGoodsSkus } from '@/service/main/goods'
import formDrawer from '@/components/formDrawer.vue'
import skuCard from './skuCard.vue'
import skuTable from './skuTable.vue'
import { goodsId, initSkuCardList, sku_list } from '@/composables/useSkus'

const form = reactive({
	sku_type: 0,
	sku_value: {
		oprice: 0,
		pprice: 0,
		cprice: 0,
		weight: 0,
		volume: 0
	}
})

const formDrawerRef = ref<InstanceType<typeof formDrawer>>()

const open = (row: any) => {
	goodsId.value = row.id
	row.skusLoading = true
	readGoods(goodsId.value)
		.then((res) => {
			form.sku_type = res.data.data.sku_type
			form.sku_value = res.data.data.sku_value || {
				oprice: 0,
				pprice: 0,
				cprice: 0,
				weight: 0,
				volume: 0
			}
			initSkuCardList(res.data.data)
			formDrawerRef.value?.open()
		})
		.finally(() => {
			row.skusLoading = false
		})
}

const emit = defineEmits(['reloadDate'])
const submit = () => {
	formDrawerRef.value?.showLoading()
	let data = {
		sku_type: form.sku_type,
		sku_value: form.sku_value,
		goodsSkus: null
	}
	if (form.sku_type == 1) {
		data.goodsSkus = sku_list.value
	}
	updateGoodsSkus(goodsId.value, data)
		.then(() => {
			toast('设置商品规格成功')
			formDrawerRef.value?.close()
			emit('reloadDate')
		})
		.finally(() => {
			formDrawerRef.value?.hideLoading()
		})
}

defineExpose({
	open
})
</script>
<template>
	<formDrawer ref="formDrawerRef" @submit="submit" title="设置商品规格" size="60%" destoryClose>
		<el-form :model="form" label-width="80px">
			<el-form-item label="商品规格">
				<el-radio-group v-model="form.sku_type">
					<el-radio :label="0" size="large" border>单规格</el-radio>
					<el-radio :label="1" size="large" border>多规格</el-radio>
				</el-radio-group>
			</el-form-item>
			<template v-if="form.sku_type === 0">
				<el-form-item label="市场价格">
					<el-input v-model="form.sku_value.pprice" style="width: 30%">
						<template #append>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="销售价格">
					<el-input v-model="form.sku_value.cprice" style="width: 30%">
						<template #append>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="成本价格">
					<el-input v-model="form.sku_value.oprice" style="width: 30%">
						<template #append>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="商品重量">
					<el-input v-model="form.sku_value.weight" style="width: 30%">
						<template #append>公斤</template>
					</el-input>
				</el-form-item>
				<el-form-item label="商品体积">
					<el-input v-model="form.sku_value.volume" style="width: 30%">
						<template #append>立方米</template>
					</el-input>
				</el-form-item>
			</template>
			<template v-else>
				<skuCard />
				<skuTable />
			</template>
		</el-form>
	</formDrawer>
</template>

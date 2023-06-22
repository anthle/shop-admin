<script setup lang="ts">
import { getAgentStatistics } from '@/service/main/distribution'

const list = ref()
const loading = ref(false)
loading.value = true
getAgentStatistics()
	.then((res) => {
		list.value = res.data.data.panels
	})
	.finally(() => (loading.value = false))
</script>

<template>
	<el-row :gutter="20" class="mb-4">
		<el-col :span="6" :offset="0" v-for="item in 4" :key="item">
			<el-skeleton style="width: 100%" v-if="loading">
				<template #template>
					<el-card class="box-card">
						<el-skeleton-item variant="text" style="width: 50%" />
					</el-card>
				</template>
			</el-skeleton>
		</el-col>
		<el-col :span="6" :offset="0" v-for="item in list" :key="item.label">
			<el-card shadow="never">
				<div class="flex items-center">
					<el-icon class="text-white rounded-full" :class="item.color" :size="20">
						<User v-if="item.label === '分销员人数(人)'" />
						<ShoppingCart v-if="item.label === '订单数(单)'" />
						<PriceTag v-if="item.label === '订单金额(元)'" />
						<Timer v-if="item.label === '提现次数(次)'" />
					</el-icon>
					<div class="ml-3">
						<div class="text-lg font-bold">{{ item.value }}</div>
						<small class="text-xs text-gray-400">{{ item.label }}</small>
					</div>
				</div>
			</el-card>
		</el-col>
	</el-row>
</template>
<style lang="less" scoped>
:deep(.el-icon) {
	height: 40px;
	width: 40px;
	color: rgb(255 255 255 / var(--tw-text-opacity));
}
</style>

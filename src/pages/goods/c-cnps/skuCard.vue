<script setup lang="ts">
import skuCardItem from './skuCardItem.vue'
import { sku_card_list, addSkuCardEvent, btnLoading } from '@/composables/useSkus'
</script>

<template>
	<el-form-item label="规格选项">
		<el-card shadow="never" class="w-full mb-3" v-for="item in sku_card_list" :key="item.id">
			<template #header>
				<div class="flex items-center">
					<el-input v-model="item.text" placeholder="规格名称" style="width: 200px">
						<template #append>
							<el-icon><More /></el-icon>
						</template>
					</el-input>
					<el-button class="ml-auto">
						<el-icon><Top /></el-icon>
					</el-button>
					<el-button>
						<el-icon><Bottom /></el-icon>
					</el-button>
					<el-button>
						<el-icon><Delete /></el-icon>
					</el-button>
				</div>
			</template>
			<!-- card body -->
			<skuCardItem :skuCardId="item.id" />
		</el-card>
		<el-button type="success" @click="addSkuCardEvent" :loading="btnLoading">添加规格</el-button>
	</el-form-item>
</template>
<style lang="less" scoped>
:global(.el-card__header) {
	@apply p-2 bg-gray-50;
}
</style>

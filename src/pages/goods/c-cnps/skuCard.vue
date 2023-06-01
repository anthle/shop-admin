<script setup lang="ts">
import skuCardItem from './skuCardItem.vue'
import chooseSku from '@/components/chooseSku.vue'
import {
	sku_card_list,
	addSkuCardEvent,
	btnLoading,
	handleUpdate,
	handleDelete,
	sortCard,
	bodyLoading,
	handleChooseSetGoodsSkusCard
} from '@/composables/useSkus'

const chooseSkuRef = ref<InstanceType<typeof chooseSku>>()
const handleChooseSku = (item: any) => {
	chooseSkuRef.value?.open((val: any) => {
		handleChooseSetGoodsSkusCard(item.id, {
			name: val.name,
			value: val.list
		})
	})
}
</script>

<template>
	<el-form-item label="规格选项" v-loading="bodyLoading">
		<el-card
			shadow="never"
			class="w-full mb-3"
			v-for="(item, index) in sku_card_list"
			:key="item.id"
			v-loading="item.loading"
		>
			<template #header>
				<div class="flex items-center">
					<el-input v-model="item.text" placeholder="规格名称" style="width: 200px" @blur="handleUpdate(item)">
						<template #append>
							<el-icon class="cursor-pointer" @click="handleChooseSku(item)"><More /></el-icon>
						</template>
					</el-input>
					<el-button class="ml-auto" @click="sortCard('up', index)" :disabled="index == 0">
						<el-icon><Top /></el-icon>
					</el-button>
					<el-button @click="sortCard('down', index)" :disabled="index === sku_card_list.length - 1">
						<el-icon><Bottom /></el-icon>
					</el-button>
					<el-popconfirm
						title="是否要删除该规格?"
						confirm-button-text="确定"
						cancel-button-text="取消"
						width="180"
						@confirm="handleDelete(item)"
					>
						<template #reference>
							<el-button>
								<el-icon><Delete /></el-icon>
							</el-button>
						</template>
					</el-popconfirm>
				</div>
			</template>
			<!-- card body -->
			<skuCardItem :skuCardId="item.id" />
		</el-card>
		<el-button type="success" @click="addSkuCardEvent" :loading="btnLoading">添加规格</el-button>
		<chooseSku ref="chooseSkuRef" />
	</el-form-item>
</template>
<style lang="less" scoped>
:global(.el-card__header) {
	@apply p-2 bg-gray-50;
}
</style>

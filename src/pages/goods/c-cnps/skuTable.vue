<script setup lang="ts">
import { initSkuTable } from '@/composables/useSkus'

const { skuLabels, tableThs, sku_list } = initSkuTable()
</script>

<template>
	<el-form-item label="规格设置">
		<table class="w-full table_border">
			<thead>
				<tr>
					<th
						class="table_border"
						v-for="(th, thi) in tableThs"
						:key="thi"
						:width="th.width"
						:colspan="th.colspan"
						:rowspan="th.rowspan"
					>
						{{ th.name }}
					</th>
				</tr>
				<tr>
					<th class="table_border" v-for="(th, thi) in skuLabels" :key="thi">
						{{ th.name }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr class="table_border text-center" v-for="(item, index) in sku_list" :key="index">
					<td class="table_border" v-for="(sku, skuI) in item.skus" :key="skuI">
						{{ sku.value }}
					</td>
					<td class="table_border">
						<el-input v-model="item.pprice" size="small" type="number"></el-input>
					</td>
					<td class="table_border">
						<el-input v-model="item.oprice" size="small" type="number"></el-input>
					</td>
					<td class="table_border">
						<el-input v-model="item.cprice" size="small" type="number"></el-input>
					</td>
					<td class="table_border">
						<el-input v-model="item.stock" size="small" type="number"></el-input>
					</td>
					<td class="table_border">
						<el-input v-model="item.volume" size="small" type="number"></el-input>
					</td>
					<td class="table_border">
						<el-input v-model="item.weight" size="small" type="number"></el-input>
					</td>
					<td class="table_border">
						<el-input v-model="item.code" size="small" type="number"></el-input>
					</td>
				</tr>
			</tbody>
		</table>
	</el-form-item>
</template>
<style lang="less" scoped>
.table_border {
	@apply border border-solid border-collapse;
}
</style>

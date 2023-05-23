<script setup lang="ts">
import { toast } from '@/composables/useEle'
import { readGoods, setGoodsBanner } from '@/service/main/goods'

const dialogVisible = ref(false)

const form = reactive({
	banners: []
})

const goodsId = ref(0)
const open = (row: any) => {
	goodsId.value = row.id
	row.bannersLoading = true
	readGoods(goodsId.value)
		.then((res) => {
			form.banners = res.data.data.goodsBanner.map((o: any) => o.url)
			dialogVisible.value = true
		})
		.finally(() => {
			row.bannersLoading = false
		})
}

const emit = defineEmits(['reloadDate'])
const loading = ref(false)
const submit = () => {
	loading.value = true
	setGoodsBanner(goodsId.value, form.banners)
		.then((res) => {
			toast('设置轮播图成功')
			dialogVisible.value = false
			emit('reloadDate')
		})
		.finally(() => {
			loading.value = false
		})
}

defineExpose({
	open
})
</script>
<template>
	<el-drawer title="设置轮播图" v-model="dialogVisible" size="30%" destroy-on-close>
		<el-form :model="form" label-width="80px">
			<el-form-item label="轮播图">
				<ChooseImage limit="9" v-model="form.banners" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submit" :loading="loading">提交</el-button>
			</el-form-item>
		</el-form>
	</el-drawer>
</template>

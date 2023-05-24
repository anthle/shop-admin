<script setup lang="ts">
import { toast } from '@/composables/useEle'
import { readGoods, updateGoods } from '@/service/main/goods'
import formDrawer from '@/components/formDrawer.vue'
import EditorVue from '@/components/Editor.vue'

const form = reactive({
	content: ''
})

const formDrawerRef = ref<InstanceType<typeof formDrawer>>()

const goodsId = ref(0)
const open = (row: any) => {
	goodsId.value = row.id
	row.contentLoading = true
	readGoods(goodsId.value)
		.then((res) => {
			form.content = res.data.data.content
			formDrawerRef.value?.open()
		})
		.finally(() => {
			row.contentLoading = false
		})
}

const emit = defineEmits(['reloadDate'])
const submit = () => {
	formDrawerRef.value?.showLoading()
	updateGoods(goodsId.value, form)
		.then(() => {
			toast('设置商品详情成功')
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
	<formDrawer ref="formDrawerRef" @submit="submit" title="设置商品详情" size="40%" destroy-on-close>
		<el-form :model="form" label-width="80px">
			<el-form-item label="商品详情">
				<EditorVue v-model="form.content" />
			</el-form-item>
		</el-form>
	</formDrawer>
</template>

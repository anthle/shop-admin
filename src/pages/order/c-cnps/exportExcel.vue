<script setup lang="ts">
interface Props {
	tabs: any
}

const props = withDefaults(defineProps<Props>(), {
	tabs: []
})
const form = reactive({
	tab: ''
})

const dialogVisible = ref(false)

const open = () => (dialogVisible.value = true)
const close = () => (dialogVisible.value = false)

const onSubmit = () => {
	console.log('导出')
}

defineExpose({
	open
})
</script>

<template>
	<el-drawer title="导出" v-model="dialogVisible" size="30%">
		<el-form :model="form" label-width="80px">
			<el-form-item label="订单类型">
				<el-select v-model="form.tab" placeholder="请选择">
					<el-option v-for="item in props.tabs" :key="item.key" :label="item.name" :value="item.key"> </el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">导出</el-button>
			</el-form-item>
		</el-form>
	</el-drawer>
</template>

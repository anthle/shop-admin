<script setup lang="ts">
import { toast } from '@/composables/useEle'
import { exportOrder } from '@/service/main/order'
import { downloadExcelFile } from '@/composables/utils'

interface Props {
	tabs: Array<{ label: string; name: string }>
}
const props = defineProps<Props>()

const form = reactive({
	tab: '',
	time: ''
})

const dialogVisible = ref(false)

const open = () => (dialogVisible.value = true)
const close = () => (dialogVisible.value = false)

const loading = ref(false)
const onSubmit = () => {
	if (!form.tab) return toast('订单类型不能为空', 'error')
	loading.value = true
	let starttime = null
	let endtime = null
	if (form.time && Array.isArray(form.time)) {
		starttime = form.time[0]
		endtime = form.time[1]
	}
	exportOrder({
		tab: form.tab,
		starttime,
		endtime
	})
		.then((res) => {
			downloadExcelFile(res.data)
			close()
		})
		.finally(() => (loading.value = false))
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
					<el-option v-for="item in props.tabs" :key="item.name" :label="item.label" :value="item.name"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="时间范围">
				<el-date-picker
					v-model="form.time"
					type="daterange"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					value-format="YYYY-MM-DD"
				/>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit" :loading="loading">导出</el-button>
			</el-form-item>
		</el-form>
	</el-drawer>
</template>

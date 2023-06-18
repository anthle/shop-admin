<script setup lang="ts">
import { toast } from '@/composables/useEle'
import { getShipInfo } from '@/service/main/order'

const props = defineProps<{
	modelValue?: boolean
}>()

const dialogVisible = ref(false)

const info = ref()
const open = async (id: number) => {
	return getShipInfo(id).then((res) => {
		if (res.data.data.status !== 0) {
			return toast(res.data.data.msg, 'error')
		}
		info.value = res.data.data.result
		dialogVisible.value = true
	})
}

defineExpose({
	open
})
</script>
dialogVisible
<template>
	<el-drawer title="物流信息" v-model="dialogVisible" direction="rtl" size="30%">
		<el-card shadow="never" class="!border-0 mb-3">
			<div class="flex items-center">
				<el-image
					:src="info.logo"
					fit="fill"
					:lazy="true"
					style="width: 60px; height: 60px"
					class="rounded border"
				></el-image>
				<div class="ml-3">
					<p>物流公司：{{ info.typename }}</p>
					<p>物流单号：{{ info.number }}</p>
				</div>
			</div>
		</el-card>

		<el-card shadow="never" class="!border-0 !border-t">
			<el-timeline class="!ml-[-40px]">
				<el-timeline-item :timestamp="item.time" placement="top" v-for="(item, index) in info.list" :key="index">
					{{ item.status }}
				</el-timeline-item>
			</el-timeline>
		</el-card>
	</el-drawer>
</template>

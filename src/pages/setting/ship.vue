<script setup lang="ts">
import { toast } from '@/composables/useEle'
import { getSysConfig, setSysConfig } from '@/service/main/sysconfig'
import type { ShipForm } from './types'

const form: ShipForm = reactive({
	ship: '****已配置****'
})

const loading = ref(false)
function getData() {
	loading.value = true
	getSysConfig()
		.then((res) => {
			for (const k in form) {
				form[k] = res.data.data[k]
			}
		})
		.finally(() => (loading.value = false))
}
getData()

const submit = () => {
	loading.value = true
	setSysConfig({ ...form })
		.then(() => {
			toast('修改成功')
			getData()
		})
		.finally(() => (loading.value = false))
}
</script>

<template>
	<div v-loading="loading" class="bg-white p-4 rounded">
		<el-form :model="form" label-width="160">
			<el-form-item label="物流查询key">
				<div style="width: 100%">
					<el-input v-model="form.ship" placeholder="物流查询Key" style="width: 50%"></el-input>
					<small class="text-gray-500 mt-1"
						>用于查询物流信息，
						<a class="no-underline text-inherit" target="_blank" href="https://www.jisuapi.com/api/express/"
							>接口申请（仅供参考）</a
						>
					</small>
				</div>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="submit">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

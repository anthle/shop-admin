<script setup lang="ts">
import { toast } from '@/composables/useEle'
import { getSysConfig, setSysConfig, uploadAction } from '@/service/main/sysconfig'
import type { BuyForm } from './types'
import formDrawer from '@/components/formDrawer.vue'
import { getToken } from '@/composables/auth'
import type { UploadFile, UploadFiles } from 'element-plus'
const token = getToken()

const form: BuyForm = reactive({
	close_order_minute: 30,
	auto_received_day: 7,
	after_sale_day: 23,
	alipay: {
		app_id: '****已配置****',
		ali_public_key: '****已配置****',
		private_key: '****已配置****'
	},
	wxpay: {
		app_id: '****已配置****',
		miniapp_id: '****已配置****',
		secret: '****已配置****',
		appid: '****已配置****',
		mch_id: '****已配置****',
		key: '****已配置****',
		cert_client: '****已配置****.pem',
		cert_key: '****已配置****.pem'
	}
})

const tableDate = [
	{
		name: '支付宝支付',
		desc: '该系统支持即时到账接口',
		src: '/public/alipay.png',
		key: 'alipay'
	},
	{
		name: '微信支付',
		desc: '该系统支持微信网页支付和扫码支付',
		src: '/public/wepay.png',
		key: 'wepay'
	}
]

const activeName = ref('first')

const loading = ref(false)
function getData() {
	loading.value = true
	getSysConfig()
		.then((res) => {
			for (const k in form) {
				;(form as any)[k] = (res.data.data as any)[k]
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

const formDrawerRef = ref<InstanceType<typeof formDrawer>>()
const drawerType = ref()

const open = (key: string) => {
	drawerType.value = key
	formDrawerRef.value?.open()
}

const uploadClientSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	form.wxpay.cert_client = response.data
}
const uploadKeySuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	form.wxpay.cert_key = response.data
}
</script>

<template>
	<div v-loading="loading" class="bg-white p-4 rounded">
		<el-form :model="form" label-width="160px">
			<el-tabs v-model="activeName">
				<el-tab-pane label="注册与访问" name="first">
					<el-table :data="tableDate" border stripe>
						<el-table-column label="支付方式" align="left">
							<template #default="{ row }">
								<div class="flex items-center">
									<el-image
										:src="row.src"
										fit="fill"
										:lazy="true"
										style="width: 40px; height: 40px"
										class="rounded mx-2"
									></el-image>
									<div>
										<span>{{ row.name }}</span>
										<small class="flex text-gray-500 mt-1">{{ row.desc }}</small>
									</div>
								</div>
							</template>
						</el-table-column>

						<el-table-column label="操作" align="center" width="150">
							<template #default="{ row }">
								<el-button type="primary" size="small" text @click="open(row.key)">配置</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>

				<el-tab-pane label="购物设置" name="sed">
					<el-form-item label="未支付订单">
						<div>
							<el-input v-model="form.close_order_minute" type="number" style="width: 250px">
								<template #append> 分钟后自动关闭 </template>
							</el-input>
							<small class="text-gray-500 flex mt-1">订单下单未付款，n分钟后自动关闭，设置0不自动关闭</small>
						</div>
					</el-form-item>
					<el-form-item label="已发货订单">
						<div>
							<el-input v-model="form.auto_received_day" type="number" style="width: 250px">
								<template #append> 天后自动确认收货 </template>
							</el-input>
							<small class="text-gray-500 flex mt-1">如果在期间未确认收货，系统自动完成收货，设置0不自动收货</small>
						</div>
					</el-form-item>
					<el-form-item label="未支付订单">
						<div>
							<el-input v-model="form.after_sale_day" type="number" style="width: 250px">
								<template #append> 天内允许申请售后 </template>
							</el-input>
							<small class="text-gray-500 flex mt-1"
								>订单完成后 ，用户在n天内可以发起售后申请，设置0不允许申请售后</small
							>
						</div>
					</el-form-item>
				</el-tab-pane>
			</el-tabs>
		</el-form>

		<formDrawer title="配置" @submit="submit" ref="formDrawerRef" size="40%">
			<el-form v-if="drawerType === 'alipay'" :model="form" label-width="80px">
				<el-form-item label="app_id">
					<el-input v-model="form.alipay.app_id" style="width: 90%" placeholder="app_id"></el-input>
				</el-form-item>
				<el-form-item label="公钥">
					<el-input
						v-model="form.alipay.ali_public_key"
						style="width: 90%"
						placeholder="ali_public_key"
						type="textarea"
						:row="4"
					></el-input>
				</el-form-item>
				<el-form-item label="私钥">
					<el-input
						v-model="form.alipay.private_key"
						style="width: 90%"
						placeholder="private_key"
						type="textarea"
						:row="4"
					></el-input>
				</el-form-item>
			</el-form>

			<el-form v-else :model="form" label-width="120px">
				<el-form-item label="公众号 APPID">
					<el-input v-model="form.wxpay.app_id" style="width: 90%" placeholder="app_id"></el-input>
				</el-form-item>
				<el-form-item label="小程序 APPID">
					<el-input v-model="form.wxpay.miniapp_id" style="width: 90%" placeholder="miniapp_id"></el-input>
				</el-form-item>
				<el-form-item label="小程序 secret">
					<el-input v-model="form.wxpay.secret" style="width: 90%" placeholder="secret"></el-input>
				</el-form-item>
				<el-form-item label="appid">
					<el-input v-model="form.wxpay.appid" style="width: 90%" placeholder="appid"></el-input>
				</el-form-item>
				<el-form-item label="商户号">
					<el-input v-model="form.wxpay.mch_id" style="width: 90%" placeholder="mch_id"></el-input>
				</el-form-item>
				<el-form-item label="API 密钥">
					<el-input v-model="form.wxpay.key" style="width: 90%" placeholder="key"></el-input>
				</el-form-item>
				<el-form-item label="cert_client">
					<el-upload
						:action="uploadAction"
						:limit="1"
						:headers="{ token }"
						accept=".pem"
						:on-success="uploadClientSuccess"
					>
						<el-button type="primary" size="small">点击上传</el-button>
						<template #tip>
							<div class="text-rose-500">
								{{ form.wxpay.cert_client ? form.wxpay.cert_client : '还未配置' }}
							</div>
							<small class="text-gray-500">例如：apiclient_cert.pem</small>
						</template>
					</el-upload>
				</el-form-item>
				<el-form-item label="cert_key">
					<el-upload
						:action="uploadAction"
						:limit="1"
						:headers="{ token }"
						accept=".pem"
						:on-success="uploadKeySuccess"
					>
						<el-button type="primary" size="small">点击上传</el-button>
						<template #tip>
							<div class="text-rose-500">
								{{ form.wxpay.cert_key ? form.wxpay.cert_key : '还未配置' }}
							</div>
							<small class="text-gray-500">apiclient_key.pem</small>
						</template>
					</el-upload>
				</el-form-item>
			</el-form>
		</formDrawer>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
	name: '',
	password: ''
})

const onSubmit = () => {
	console.log(form)
}
</script>

<template>
	<el-row class="min-h-screen bg-indigo-500">
		<el-col :lg="16" :md="12" class="flex justify-center items-center" style="display: flex">
			<div>
				<h1 class="text-5xl text-white font-bold mb-4">欢迎光临</h1>
				<span class="text-gray-200 text-2xl">Shop-Admin</span>
			</div>
		</el-col>
		<el-col :lg="8" :md="12" class="bg-white flex justify-center items-center flex-col" style="display: flex">
			<h1 class="text-gray-800 font-bold text-3xl">欢迎回来</h1>
			<div class="flex justify-center items-center my-5 text-gray-300 space-x-2">
				<span class="h-[1px] w-16 bg-gray-200"></span>
				<span>账号密码登录</span>
				<span class="h-[1px] w-16 bg-gray-200"></span>
			</div>
			<el-form :model="form" class="w-[250px]">
				<el-form-item>
					<el-input v-model="form.name" placeholder="请输入用户名">
						<template #prefix>
							<IEpUser />
						</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="form.password" placeholder="请输入密码" type="password">
						<template #prefix> <IEpLock /> </template
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button class="w-[250px]" color="#626aef" round type="primary" @click="onSubmit()">登录</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
</template>

<style lang="less" scoped></style>

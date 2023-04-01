<script setup lang="ts">
import { useLoginStore } from '@/stores/login'
import { storeToRefs } from 'pinia'
import { showModal } from '@/composables/useEle'
import { useFullscreen } from '@vueuse/core'
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const { logoutAction, updatePasswordAction } = useLoginStore()

const { isFullscreen, toggle } = useFullscreen()

const drawer = ref(false)

const isLoading = ref(false)

const form = reactive({
	oldpassword: '',
	password: '',
	repassword: ''
})

const formRef = ref<FormInstance>()

// 表单自定义规则
const rules = reactive<FormRules>({
	oldpassword: [
		{
			required: true,
			message: '请输入旧密码',
			trigger: 'blur'
		}
	],
	password: [
		{
			required: true,
			message: '请输入新密码',
			trigger: 'blur'
		}
	],
	repassword: [
		{
			required: true,
			message: '请输入确定密码',
			trigger: 'blur'
		}
	]
})

const logout = () => {
	showModal('是否要退出登录?').then(() => {
		logoutAction()
	})
}

const handleCommand = (command: string | number | object) => {
	switch (command) {
		case 'rePassword':
			drawer.value = true
			break
		case 'logout':
			logout()
			break
	}
}

const refresh = () => {
	window.location.reload()
}

const loginStore = useLoginStore()
const { userInfo } = storeToRefs(loginStore)

const onSubmit = (formEl: FormInstance | undefined) => {
	isLoading.value = true
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			updatePasswordAction(form).finally(() => {
				isLoading.value = false
			})
		} else {
			isLoading.value = false
			return false
		}
	})
}

const enterSubmit = () => {
	onSubmit(formRef.value)
}
</script>

<template>
	<div class="flex items-center bg-indigo-500 text-white h-16 fixed left-0 right-0">
		<span class="flex justify-center w-[250px] items-center text-xl font-thin">
			<IEpEleme-filled class="mr-2" />
			shop-admin
		</span>
		<el-tooltip class="box-item" effect="dark" content="伸缩" placement="bottom">
			<IEpFold class="cursor-pointer hover:bg-indigo-600 h-16 w-7 outline-none" />
		</el-tooltip>
		<el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom">
			<IEpRefresh class="cursor-pointer hover:bg-indigo-600 h-16 w-7 ml-4 outline-none" @click="refresh" />
		</el-tooltip>

		<div class="ml-auto flex items-center">
			<el-tooltip class="box-item" effect="dark" content="全屏" placement="bottom" v-if="!isFullscreen">
				<IEpFull-screen class="cursor-pointer hover:bg-indigo-600 h-16 w-7 outline-none" @click="toggle" />
			</el-tooltip>
			<el-tooltip class="box-item" effect="dark" content="退出全屏" placement="bottom" v-else>
				<IEpAim class="cursor-pointer hover:bg-indigo-600 h-16 w-7 outline-none" @click="toggle" />
			</el-tooltip>

			<el-dropdown @command="handleCommand">
				<span class="h-16 cursor-pointer flex justify-center items-center mx-5 text-white outline-none">
					<el-avatar class="mr-2" :size="25" :src="userInfo.avatar"></el-avatar>
					{{ userInfo.username }}
					<IEpArrow-down class="ml-1" />
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
						<el-dropdown-item command="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>

		<el-drawer v-model="drawer" title="修改密码" size="20%">
			<el-form :model="form" class="w-[300px]" :rules="rules" ref="formRef" label-width="80px" size="small">
				<el-form-item prop="oldpassword" label="旧密码">
					<el-input v-model="form.oldpassword" placeholder="请输入旧密码" type="password" show-password>
						<template #prefix>
							<IEpLock />
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password" label="新密码">
					<el-input v-model="form.password" placeholder="请输入新密码" type="password" show-password>
						<template #prefix> <IEpLock /> </template
					></el-input>
				</el-form-item>
				<el-form-item prop="repassword" label="确认密码">
					<el-input
						v-model="form.repassword"
						placeholder="请输入确认密码"
						type="password"
						show-password
						@keyup.enter="enterSubmit"
					>
						<template #prefix> <IEpLock /> </template
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button class="w-[250px]" color="#626aef" round :loading="isLoading" @click="onSubmit(formRef)"
						>提交</el-button
					>
				</el-form-item>
			</el-form>
		</el-drawer>
	</div>
</template>

<style lang="less" scoped>
:global(.el-dropdown-menu__item) {
	line-height: 36px;
	padding: 6px 22px;
	font-weight: 600;
}
</style>

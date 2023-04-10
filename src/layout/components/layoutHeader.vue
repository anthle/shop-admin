<script setup lang="ts">
import { useLoginStore } from '@/stores/login'
import { storeToRefs } from 'pinia'
import { showModal } from '@/composables/useEle'
import { useFullscreen } from '@vueuse/core'
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import FormDrawer from '@/components/formDrawer.vue'

const { logoutAction, updatePasswordAction } = useLoginStore()

const { isFullscreen, toggle } = useFullscreen()

const formDrawerRef = ref()

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

// 修改密码
const logout = () => {
	showModal('是否要退出登录?').then(() => {
		logoutAction()
	})
}

const handleCommand = (command: string) => {
	switch (command) {
		case 'rePassword':
			formDrawerRef.value.open()
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

// 提交表单
const onSubmit = (formEl: FormInstance | undefined) => {
	formDrawerRef.value.showLoading()
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			updatePasswordAction(form).finally(() => {
				formDrawerRef.value.hideLoading()
			})
		} else {
			formDrawerRef.value.hideLoading()
			return false
		}
	})
}

const enterSubmit = () => {
	onSubmit(formRef.value)
}

const isFold = ref(false)
const emit = defineEmits(['foldChange'])
const handleMenuChangeClick = () => {
	isFold.value = !isFold.value
	emit('foldChange', isFold.value)
}
</script>

<template>
	<div class="flex items-center bg-indigo-500 text-white h-16 fixed left-0 right-0">
		<span class="flex justify-center w-[250px] items-center text-xl font-thin">
			<el-icon class="mr-2"><Eleme-filled /> </el-icon>
			shop-admin
		</span>
		<div class="w-[30px] h-16 items-center flex hover:bg-indigo-600 cursor-pointer ml-8">
			<el-tooltip class="box-item" effect="dark" content="伸缩" placement="bottom">
				<el-icon size="30px">
					<component :is="isFold ? 'Expand' : 'Fold'" @click="handleMenuChangeClick"> </component
				></el-icon>
			</el-tooltip>
		</div>

		<div class="w-[30px] h-16 items-center flex hover:bg-indigo-600 cursor-pointer ml-8">
			<el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom">
				<el-icon size="30px" @click="refresh"><Refresh /></el-icon>
			</el-tooltip>
		</div>

		<div class="ml-auto flex items-center">
			<div class="w-[30px] h-16 items-center flex hover:bg-indigo-600 cursor-pointer ml-4">
				<el-tooltip class="box-item" effect="dark" content="全屏" placement="bottom" v-if="!isFullscreen">
					<el-icon size="30px" @click="toggle"><Full-screen /></el-icon>
				</el-tooltip>
				<el-tooltip class="box-item" effect="dark" content="退出全屏" placement="bottom" v-else>
					<el-icon size="30px" class="cursor-pointer hover:bg-indigo-600" @click="toggle"><Aim /></el-icon>
				</el-tooltip>
			</div>

			<el-dropdown @command="handleCommand">
				<span class="h-16 cursor-pointer flex justify-center items-center mx-5 text-white outline-none">
					<el-avatar class="mr-2" :size="25" :src="userInfo.avatar"></el-avatar>
					{{ userInfo.username }}
					<el-icon><Arrow-down /></el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
						<el-dropdown-item command="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>

	<form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @click="onSubmit(formRef)">
		<el-form :model="form" class="w-[300px]" :rules="rules" ref="formRef" label-width="80px" size="small">
			<el-form-item prop="oldpassword" label="旧密码">
				<el-input v-model="form.oldpassword" placeholder="请输入旧密码" type="password" show-password>
					<template #prefix>
						<el-icon><Lock /></el-icon>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="password" label="新密码">
				<el-input v-model="form.password" placeholder="请输入新密码" type="password" show-password>
					<template #prefix>
						<el-icon><Lock /></el-icon> </template
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
					<template #prefix>
						<el-icon><Lock /></el-icon> </template
				></el-input>
			</el-form-item>
		</el-form>
	</form-drawer>
</template>

<style lang="less" scoped>
:global(.el-dropdown-menu__item) {
	line-height: 36px;
	padding: 6px 22px;
	font-weight: 600;
}
.f-header {
	@apply flex items-center bg-indigo-700 text-gray-50 fixed top-0 left-0 right-0;
	height: 64px;
}
</style>

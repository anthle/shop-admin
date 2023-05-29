<script setup lang="ts">
import { ref } from 'vue'
import type { EpPropMergeType } from 'element-plus/es/utils/vue/props/types'

interface IPoprs {
	title?: string
	size?: EpPropMergeType<readonly [StringConstructor, NumberConstructor], unknown, unknown> | undefined
	destoryClose?: boolean
	confirmText?: string
}

const showDrawer = ref(false)

const isLoading = ref(false)

const showLoading = () => {
	isLoading.value = true
}

const hideLoading = () => {
	isLoading.value = false
}

withDefaults(defineProps<IPoprs>(), {
	title: '标题',
	size: '20%',
	destoryClose: false,
	confirmText: '确定'
})

const open = () => {
	showDrawer.value = true
}
const close = () => {
	showDrawer.value = false
}

const emit = defineEmits(['submit'])
const submit = () => emit('submit')

defineExpose({
	open,
	close,
	showLoading,
	hideLoading
})
</script>

<template>
	<el-drawer
		v-model="showDrawer"
		:title="title"
		:size="size"
		:destroy-on-close="destoryClose"
		:close-on-click-modal="false"
	>
		<div class="w-full h-full flex flex-col">
			<div class="flex-1 overflow-y-auto text-black">
				<slot></slot>
			</div>
			<div class="my-2">
				<el-button type="primary" :loading="isLoading" @click="submit">{{ confirmText }}</el-button>
				<el-button type="default" @click="close">取消</el-button>
			</div>
		</div>
	</el-drawer>
</template>

<style lang="less" scoped>
.formDrawer {
	color: #000;
}
</style>

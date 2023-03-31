<script setup lang="ts">
import { useLoginStore } from '@/stores/login'
import { showModal } from '@/composables/useEle'

const { logoutAction } = useLoginStore()

const logout = () => {
	showModal('是否要退出登录?').then(() => {
		logoutAction()
	})
}
</script>

<template>
	<div class="index">
		<h2>index</h2>
		<button @click="logout">退出</button>
	</div>
</template>

<style lang="less" scoped>
.index {
	color: #000;
}
</style>

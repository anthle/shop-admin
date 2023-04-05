<script setup lang="ts">
import { useLoginStore } from '@/stores/login'
import { storeToRefs } from 'pinia'

const loginStore = useLoginStore()
const { userInfo } = storeToRefs(loginStore)

const asideMenus = userInfo
console.log(asideMenus)
</script>

<template>
	<div class="w-[250px] shadow-md fixed top-16 left-0 bottom-0">
		<el-menu default-active="2" class="border-0">
			<el-sub-menu index="1">
				<template #title>
					<el-icon><location /></el-icon>
					<span>Navigator One</span>
				</template>
				<el-menu-item-group title="Group One">
					<el-menu-item index="1-1">item one</el-menu-item>
					<el-menu-item index="1-2">item two</el-menu-item>
				</el-menu-item-group>
				<el-menu-item-group title="Group Two">
					<el-menu-item index="1-3">item three</el-menu-item>
				</el-menu-item-group>
				<el-sub-menu index="1-4">
					<template #title>item four</template>
					<el-menu-item index="1-4-1">item one</el-menu-item>
				</el-sub-menu>
			</el-sub-menu>
		</el-menu>
	</div>
</template>

<style lang="less" scoped>
.menu {
	color: #000;
}
</style>

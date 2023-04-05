<script setup lang="ts">
import { useLoginStore } from '@/stores/login'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import router from '@/router'

const loginStore = useLoginStore()
const { userInfo } = storeToRefs(loginStore)

defineProps<{
	isFold: boolean
}>()
const defalutActive = computed(() => {
	return router.currentRoute.value.path
})

const menuItemClick = (child: any) => {
	router.push(child.frontpath)
}
</script>

<template>
	<div
		class="transition-all duration-300 shadow-md fixed top-16 left-0 bottom-0"
		:style="{ width: isFold ? '64px' : '250px' }"
	>
		<el-menu
			class="el-menu-vertical-demo"
			:collapse="isFold"
			:collapse-transition="false"
			:default-active="defalutActive"
		>
			<template v-for="item in userInfo.menus" :key="item.id">
				<el-sub-menu :index="item.name" v-if="item.child && item.child.length > 0">
					<template #title>
						<el-icon size="20px">
							<component :is="item.icon"></component>
						</el-icon>
						<span>{{ item.name }}</span>
					</template>
					<el-menu-item
						v-for="child in item.child"
						:key="child.id"
						:index="child.frontpath"
						@click="menuItemClick(child)"
					>
						<template #title>
							<el-icon>
								<component :is="child.icon"></component>
							</el-icon>
							<span>{{ child.name }}</span>
						</template>
					</el-menu-item>
				</el-sub-menu>
				<el-sub-menu index="item.name" v-else>
					<template #title>
						<el-icon>
							<component :is="item.icon"></component>
						</el-icon>
						<el-icon><User></User></el-icon>
						<span>{{ item.name }}</span>
					</template>
				</el-sub-menu>
			</template>
		</el-menu>
	</div>
</template>

<style lang="less" scoped>
.el-menu {
	border: none;
}
</style>

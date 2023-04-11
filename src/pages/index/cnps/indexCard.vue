<script setup lang="ts">
defineProps<{
	title: string
	tip: string
	info: any
}>()
</script>

<template>
	<el-card class="mt-5">
		<template #header>
			<div class="flex justify-between">
				<span>{{ title }}</span>
				<el-tag class="ml-2" type="danger">{{ tip }}</el-tag>
			</div>
		</template>
		<el-row :gutter="20">
			<el-col :span="6" :offset="0" v-for="item in info" :key="item">
				<el-card shadow="hover" class="card">
					<div class="flex flex-col justify-center items-center">
						<span class="text-xl mb-2">{{ item.value }}</span>
						<span class="text-xs text-gray-500">{{ item.label }}</span>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</el-card>
</template>

<style lang="less" scoped>
.card {
	@apply border-0 bg-gray-100;
}
</style>

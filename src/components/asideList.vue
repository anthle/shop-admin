<script setup lang="ts">
defineProps({
	active: {
		type: Boolean,
		default: false
	},
	title: {
		type: String
	}
})
defineEmits(['edit', 'close'])
</script>

<template>
	<div class="aside-list" :class="{ active: active }">
		<span>{{ title }}</span>
		<el-button class="ml-auto p-1" text type="primary" size="small" @click="$emit('edit')">
			<el-icon><Edit /></el-icon>
		</el-button>

		<el-popconfirm
			title="是否要删除该分类?"
			confirm-button-text="确定"
			cancel-button-text="取消"
			width="180"
			@confirm="$emit('close')"
		>
			<template #reference>
				<el-button class="p-1" text type="primary" size="small">
					<el-icon><Close /></el-icon>
				</el-button>
			</template>
		</el-popconfirm>
	</div>
</template>

<style lang="less" scoped>
.aside-list {
	border-bottom: 1px solid #eeeeee;
	@apply flex  items-center p-3 text-sm text-gray-500;
}
.aside-list:hover,
.active {
	@apply bg-blue-50;
}
</style>

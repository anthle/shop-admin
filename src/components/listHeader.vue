<script setup lang="ts">
defineEmits(['create', 'refresh'])
</script>

<template>
	<div class="top mb-4 flex justify-between">
		<el-button type="primary" @click="$emit('create')">新增</el-button>
		<el-tooltip class="box-item" effect="dark" content="刷新数据" placement="top">
			<el-button text @click="$emit('refresh')">
				<el-icon :size="20">
					<Refresh />
				</el-icon>
			</el-button>
		</el-tooltip>
	</div>
</template>

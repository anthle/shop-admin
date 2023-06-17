<script setup lang="ts">
const props = defineProps({
	layout: {
		type: String,
		default: 'create,refresh'
	}
})

const btns = computed(() => props.layout.split(','))

defineEmits(['create', 'refresh', 'delete', 'download'])
</script>

<template>
	<div class="top mb-4 flex justify-between">
		<div>
			<el-button type="primary" @click="$emit('create')" v-if="btns.includes('create')">新增</el-button>

			<el-popconfirm
				title="是否要删除选中记录?"
				confirm-button-text="确定"
				cancel-button-text="取消"
				width="180"
				@confirm="$emit('delete')"
				v-if="btns.includes('delete')"
			>
				<template #reference>
					<el-button type="danger">批量删除</el-button>
				</template>
			</el-popconfirm>
			<slot />
		</div>
		<div>
			<el-tooltip class="box-item" effect="dark" content="刷新数据" placement="top">
				<el-button text @click="$emit('refresh')">
					<el-icon :size="18">
						<Refresh />
					</el-icon>
				</el-button>
			</el-tooltip>
			<el-tooltip v-if="layout.includes('download')" class="box-item" effect="dark" content="导出数据" placement="top">
				<el-button text @click="$emit('download')">
					<el-icon :size="18">
						<Download />
					</el-icon>
				</el-button>
			</el-tooltip>
		</div>
	</div>
</template>

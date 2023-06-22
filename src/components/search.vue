<script setup lang="ts">
interface Props {
	model: Object
	length?: number
}

const props = withDefaults(defineProps<Props>(), {
	length: 1
})
defineEmits(['search', 'reset'])
const showSearch = ref(false)

// 判断页面是否需要展开按钮
const slots = useSlots()
const hasShowSearch = ref(!!slots.show)

const checkNumber = computed(() => {
	const length = props.length
	if (showSearch.value) {
		return (
			length !== undefined && (length === 1 || length === 4 || length === 7 || (length > 10 && (length - 7) % 4 === 0))
		)
	}
	return false
})
</script>

<template>
	<el-form :model="model" label-width="80" class="mb-3" size="small">
		<el-row :gutter="20">
			<slot />
			<template v-if="showSearch">
				<slot name="show" />
			</template>
			<el-col :span="checkNumber ? 16 : 8" :offset="showSearch ? 0 : 8">
				<div class="flex items-center justify-end">
					<el-button type="primary" @click="$emit('search')">搜索</el-button>
					<el-button type="primary" @click="$emit('reset')">重置</el-button>
					<el-button type="primary" text @click="showSearch = !showSearch" v-if="hasShowSearch">
						{{ showSearch ? '收起' : '展开' }}
						<el-icon>
							<ArrowDown v-if="!showSearch" />
							<ArrowUp v-else />
						</el-icon>
					</el-button>
				</div>
			</el-col>
		</el-row>
	</el-form>
</template>

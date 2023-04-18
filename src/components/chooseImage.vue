<script setup lang="ts">
import ImageAside from '@/components/imageAside.vue'
import ImageMain from '@/components/imageMain.vue'

// open
const dialogTableVisible = ref(false)
const open = () => {
	dialogTableVisible.value = true
}

// 新增图片
const imgAsideRef = ref<InstanceType<typeof ImageAside>>()
const handleAddImgType = () => {
	imgAsideRef.value!.handleAdd()
}

// 上传图片
const imgMainRef = ref<InstanceType<typeof ImageMain>>()
const handleAsideChange = (id: number) => {
	imgMainRef.value!.loadData(id)
}

const handleUploadImg = () => {
	imgMainRef.value!.openDrawer()
}

// 选择头像
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

let urls: string[] = []
const handleChooseImage = (item: any) => {
	urls = item.map((i: any) => i.url)
}

const submit = () => {
	if (urls.length) {
		emit('update:modelValue', urls[0])
		dialogTableVisible.value = false
	}
}
</script>

<template>
	<div v-if="modelValue">
		<el-image :src="modelValue" fit="cover" :lazy="true" class="w-[100px] h-[100px] rounded mr-2"></el-image>
	</div>
	<div
		class="w-[100px] h-[100px] rounded border border-gray-100 border-solid flex justify-center items-center cursor-pointer hover:bg-gray-100"
		@click="open"
	>
		<el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
	</div>

	<el-dialog v-model="dialogTableVisible" title="选择图片" width="80%" top="5vh">
		<el-container class="bg-white" style="height: 70vh">
			<el-header class="img-header">
				<el-button type="primary" @click="handleAddImgType">新增图片分类</el-button>
				<el-button type="warning" @click="handleUploadImg">上传图片</el-button>
			</el-header>
			<el-container>
				<ImageAside ref="imgAsideRef" @change="handleAsideChange" />
				<ImageMain openClose ref="imgMainRef" @choose="handleChooseImage" />
			</el-container>
		</el-container>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogTableVisible = false">取消</el-button>
				<el-button type="primary" @click="submit"> 确认 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="less" scoped></style>

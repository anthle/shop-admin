<script setup lang="ts">
import ImageAside from '@/components/imageAside.vue'
import ImageMain from '@/components/imageMain.vue'
import { toast } from '@/composables/useEle'

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
const props = defineProps<{
	modelValue: any
	limit?: any
}>()
const emit = defineEmits(['update:modelValue'])

let urls: string[] = []
const handleChooseImage = (item: any) => {
	urls = item.map((i: any) => i.url)
}

const submit = () => {
	let value = [] as any
	if (props.limit === 1) {
		value = urls[0]
	} else {
		value = [...props.modelValue, ...urls]
		if (value.length > props.limit) {
			return toast('最多还能选择' + (props.limit - props.modelValue.length) + '张')
		}
	}
	if (urls.length) {
		emit('update:modelValue', value)
		dialogTableVisible.value = false
	}
}

const removeImage = (url: any) => {
	emit(
		'update:modelValue',
		props.modelValue.filter((u: any) => u != url)
	)
}
</script>

<template>
	<div v-if="modelValue">
		<el-image
			v-if="typeof modelValue == 'string'"
			:src="modelValue"
			fit="cover"
			:lazy="true"
			class="w-[100px] h-[100px] rounded mr-2"
		></el-image>
		<div v-else class="flex flex-wrap">
			<div class="relative mx-1 mb-2 w-[100px] h-[100px]" v-for="(url, index) in modelValue" :key="index">
				<el-icon
					class="!absolute right-[5px] top-[5px] z-10 cursor-pointer bg-white rounded-full"
					@click="removeImage(url)"
					><CircleClose
				/></el-icon>
				<el-image :src="url" fit="cover" :lazy="true" class="w-[100px] h-[100px] border mr-2"></el-image>
			</div>
		</div>
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
				<ImageMain :limit="limit" openClose ref="imgMainRef" @choose="handleChooseImage" />
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

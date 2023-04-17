<script setup lang="ts">
import { getToken } from '@/composables/auth'
import { uploadImgAction } from '@/service/main/imageList'
import type { UploadFile, UploadFiles } from 'element-plus'
import { toast } from '@/composables/useEle'

const token = getToken()

defineProps<{
	data: any
}>()

const emit = defineEmits(['success', 'error'])
const uploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	toast('上传图片成功')
	emit('success', response, uploadFile, uploadFiles)
}

const uploadError = (evt: any) => {
	let msg = JSON.parse(evt.message).msg || '上传图片失败'
	toast(msg, 'error')
}
</script>

<template>
	<el-upload
		class="upload-demo"
		drag
		:action="uploadImgAction"
		multiple
		:headers="{ token }"
		:data="data"
		name="img"
		:on-success="uploadSuccess"
		:on-error="uploadError"
	>
		<el-icon class="el-icon--upload"><upload-filled /></el-icon>
		<div class="el-upload__text">Drop file here or <em>click to upload</em></div>
		<template #tip>
			<div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
		</template>
	</el-upload>
</template>

<style lang="less" scoped></style>

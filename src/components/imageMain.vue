<script setup lang="ts">
import { getImageListById, updateImageName, deleteImage } from '@/service/main/imageList'
import { showPrompt } from '@/composables/useEle'
import { toast } from '@/composables/useEle'
import UploadFile from '@/components/uploadFile.vue'

const total = ref(0)
const currentPage = ref(1)
const list = ref([] as any[])
const activeId = ref(0)
const loading = ref(false)

const getData = (page: number = 1) => {
	currentPage.value = page
	loading.value = true
	getImageListById(activeId.value, currentPage.value)
		.then((res) => {
			list.value = res.data.data.list
			total.value = res.data.data.totalCount
		})
		.finally(() => {
			loading.value = false
		})
}

const loadData = (id: any) => {
	activeId.value = id
	getData()
}

// 图片重命名
const updataImgName = (item: any) => {
	showPrompt('重命名', item.name).then(({ value }) => {
		loading.value = true
		updateImageName(item.id, value)
			.then(() => {
				toast('重命名成功')
				getData()
			})
			.finally(() => {
				loading.value = false
			})
	})
}

// 删除图片
const deleteImg = (id: any) => {
	loading.value = true
	deleteImage([id])
		.then(() => {
			toast('删除成功')
			getData()
		})
		.finally(() => {
			loading.value = false
		})
}

// 抽屉
const drawer = ref(false)

const openDrawer = () => {
	drawer.value = true
}

// 上传成功
const handleUploadSuccess = () => {
	drawer.value = false
	getData(1)
}

defineExpose({
	loadData,
	openDrawer
})
</script>

<template>
	<el-main width="220px" class="img-main" v-loading="loading">
		<div class="top p-3">
			<el-row :gutter="20">
				<el-col :span="6" :offset="0" v-for="item in list" :key="item.id">
					<el-card shadow="hover" class="relative mb-3" :body-style="{ padding: 0 }">
						<el-image :src="item.url" fit="cover" class="w-full h-[150px]"></el-image>
						<div class="image-title">{{ item.name }}</div>
						<div class="flex justify-center items-center p-2">
							<el-button type="primary" size="small" text @click="updataImgName(item)">重命名</el-button>
							<el-popconfirm
								title="是否要删除该图片?"
								confirm-button-text="确定"
								cancel-button-text="取消"
								width="180"
								@confirm="deleteImg(item.id)"
							>
								<template #reference>
									<el-button type="primary" size="small" text>删除</el-button>
								</template>
							</el-popconfirm>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
		<div class="bottom">
			<el-pagination background layout="prev,pager, next" :total="total" @current-change="getData" />
		</div>
	</el-main>

	<el-drawer v-model="drawer" title="I am the title" :with-header="false">
		<span>上传图片</span>
		<UploadFile :data="{ image_class_id: activeId }" @success="handleUploadSuccess"></UploadFile>
	</el-drawer>
</template>

<style lang="less" scoped>
.img-main {
	border-right: 1px solid #eeeeee;
	position: relative;
}
.img-main .top {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 50px;
	overflow-y: auto;
}
.img-main .bottom {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 50px;
	@apply flex justify-center items-center;
}
.image-title {
	position: absolute;
	top: 122px;
	right: 0;
	left: 0;
	@apply text-sm truncate text-gray-100 bg-opacity-60 bg-gray-800 px-2 py-1;
}
</style>

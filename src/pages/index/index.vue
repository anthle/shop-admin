<script setup lang="ts">
import { ref } from 'vue'
import { getStatistics } from '@/service/main/dashboard'
import CountTo from '@/components/countTo.vue'
import { iconNavs } from './iconsNav'
import { useRouter } from 'vue-router'

const router = useRouter()

const panels = ref([] as any[])
getStatistics().then((res) => {
	panels.value = res.data.data.panels
})
</script>

<template>
	<el-row :gutter="20">
		<!-- Skeleton -->
		<el-col :span="6" :offset="0" v-for="item in 4" :key="item">
			<el-skeleton style="width: 100%" v-if="!panels.length">
				<template #template>
					<el-card class="box-card">
						<template #header>
							<div class="flex justify-between">
								<el-skeleton-item variant="text" style="width: 50%" />
								<el-skeleton-item variant="text" style="width: 10%" />
							</div>
						</template>
						<el-skeleton-item variant="text" style="width: 80%" />
						<el-divider />
						<div class="flex justify-between text-gray-500">
							<el-skeleton-item variant="text" style="width: 50%" />
							<el-skeleton-item variant="text" style="width: 10%" />
						</div>
					</el-card>
				</template>
			</el-skeleton>
		</el-col>

		<el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
			<el-card>
				<template #header>
					<div class="flex justify-between">
						<span>{{ item.title }}</span>
						<el-tag class="ml-2" :type="item.unitColor">{{ item.unit }}</el-tag>
					</div>
				</template>
				<div class="text-3xl">
					<!-- {{ item.value }} -->
					<CountTo :num="item.value"></CountTo>
				</div>
				<el-divider />
				<div class="flex justify-between text-gray-500">
					<span>{{ item.subTitle }}</span>
					<span>{{ item.subValue }}</span>
				</div>
			</el-card>
		</el-col>
	</el-row>
	<el-row :gutter="20" class="mt-5">
		<el-col :span="3" :offset="0" v-for="item in iconNavs" :key="item.path">
			<el-card shadow="hover" @click="router.push(item.path)">
				<div class="flex flex-col items-center justify-center cursor-pointer">
					<el-icon :size="16">
						<component :class="item.color" :is="item.icon" />
					</el-icon>
					<span class="text-sm mt-2">{{ item.title }}</span>
				</div>
			</el-card>
		</el-col>
	</el-row>
</template>

<style lang="less" scoped></style>

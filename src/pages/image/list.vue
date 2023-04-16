<script setup lang="ts">
import ImageAside from '@/components/imageAside.vue'
import ImageMain from '@/components/imageMain.vue'

const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40
</script>

<template>
	<el-container :style="{ height: h + 'px' }" class="bg-white">
		<el-header class="img-header">Header</el-header>
		<el-container>
			<ImageAside />
			<ImageMain />
		</el-container>
	</el-container>
</template>

<style lang="less" scoped>
.img-header {
	border-bottom: 1px solid #eeeeee;
	@apply flex items-center;
}
.img-aside,
.img-main {
	border-right: 1px solid #eeeeee;
	position: relative;
}
.img-aside .top,
.img-main .top {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 50px;
	overflow-y: auto;
}
.img-aside .bottom,
.img-main .bottom {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 50px;
	@apply flex justify-center items-center;
}
</style>

<template>
	<el-main width="220px" class="img-main">
		<div class="top">
			<div v-for="item in 100" :key="item">{{ item }}</div>
		</div>
		<div class="bottom">分页区域</div>
	</el-main>
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
</style>

<script setup lang="ts">
import layoutHeader from './components/layoutHeader.vue'
import layoutMenu from './components/layoutMenu.vue'
</script>

<template>
	<div class="admin">
		<el-container>
			<el-header><layoutHeader /></el-header>
			<el-container>
				<el-aside width="200px"> <layoutMenu></layoutMenu> </el-aside>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<style lang="less" scoped>
.admin {
	color: #000;
}
</style>

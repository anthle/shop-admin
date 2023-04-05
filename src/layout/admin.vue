<script setup lang="ts">
import layoutHeader from './components/layoutHeader.vue'
import layoutMenu from './components/layoutMenu.vue'
import { ref } from 'vue'

const isFold = ref(false)

const handleFoldChange = (flag: boolean) => {
	isFold.value = flag
}
</script>

<template>
	<div class="admin">
		<el-container>
			<el-header><layoutHeader @fold-change="handleFoldChange" /></el-header>
			<el-container>
				<el-aside :width="isFold ? '64px' : '250px'">
					<layoutMenu :is-fold="isFold"></layoutMenu>
				</el-aside>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<style lang="less" scoped></style>

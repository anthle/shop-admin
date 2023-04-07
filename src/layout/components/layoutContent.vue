<script setup lang="ts">
import layoutTabsList from './layoutTabsList.vue'
</script>

<template>
	<div class="layoutContent">
		<layoutTabsList></layoutTabsList>
		<router-view></router-view>
	</div>
</template>

<style lang="less" scoped>
.layoutContent {
	color: #000;
}
</style>

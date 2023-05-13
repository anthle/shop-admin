<script setup lang="ts"></script>

<template>
	<div class="app">
		<router-view>123</router-view>
	</div>
</template>

<style lang="less">
.app {
	@apply bg-gray-100;
	height: 100vh;
}
::-webkit-scrollbar {
	width: 4px;
	background-color: rgba(84, 84, 84, 0.2);
}
::-webkit-scrollbar-corner {
	display: block;
}
::-webkit-scrollbar-thumb {
	border-radius: 8px;
	background-color: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
	border-right-color: transparent;
	border-left-color: transparent;
}
</style>

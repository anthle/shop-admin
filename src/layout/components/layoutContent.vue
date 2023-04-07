<script setup lang="ts">
import layoutTabsList from './layoutTabsList.vue'

defineProps<{
	isFold: boolean
}>()
</script>

<template>
	<div class="layoutContent">
		<layoutTabsList :is-fold="isFold"></layoutTabsList>

		<router-view v-slot="{ Component }">
			<transition name="fade">
				<keep-alive :max="10">
					<component :is="Component"></component>
				</keep-alive>
			</transition>
		</router-view>
	</div>
</template>

<style lang="less" scoped>
.layoutContent {
	color: #000;
}

.fade-enter-active {
	transition: all 0.3s;
	transition-delay: 0.3s;
}
.fade-leave-active {
	transition: all 0.3s;
}

.fade-enter-from {
	opacity: 0;
	-webkit-transform: translate3d(0, -100%, 0);
	transform: translate3d(0, -100%, 0);
}

.fade-enter-to {
	opacity: 1;
	-webkit-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0);
}

.fade-leave-from {
	opacity: 1;
}

.fade-leave-to {
	opacity: 0;
	-webkit-transform: translate3d(0, 100%, 0);
	transform: translate3d(0, 100%, 0);
}
</style>

<script setup lang="ts">
import { initSkusCardItem } from '@/composables/useSkus'
const props = defineProps<{
	skuCardId: any
}>()
const item = initSkusCardItem(props.skuCardId)
</script>

<template>
	<div v-for="tag in item.goodsSkusCardValue" :key="tag.id">
		{{ tag.text }}
	</div>
</template>

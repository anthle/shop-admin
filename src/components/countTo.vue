<script setup lang="ts">
import { reactive, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
	num: number
}>()

function getDecimalPlaces(num: number) {
	const match = (num + '').match(/\.\d+/)

	if (!match) {
		return 0
	}
	return match[0].length - 1
}

const decimalPlaces = getDecimalPlaces(props.num)

const d = reactive({
	num: 0
})

function AnimationToValue() {
	gsap.to(d, {
		duration: 0.5,
		num: props.num
	})
}
AnimationToValue()

watch(
	() => props.num,
	() => {
		AnimationToValue()
	}
)
</script>

<template>
	<div>{{ d.num.toFixed(decimalPlaces) }}</div>
</template>

<style lang="less" scoped></style>

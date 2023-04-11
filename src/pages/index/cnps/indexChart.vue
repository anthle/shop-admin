<script setup lang="ts">
import * as echarts from 'echarts'
import { getStatistics3 } from '@/service/main/dashboard'
import { useResizeObserver } from '@vueuse/core'

const current = ref('week')
const options = [
	{
		text: '近一个月',
		value: 'month'
	},
	{
		text: '近一周',
		value: 'week'
	},
	{
		text: '近24小时',
		value: 'hour'
	}
]

const handleChoose = (value: string) => {
	current.value = value
	getData()
}

let myChart: any = null
onMounted(() => {
	let chartDom = document.getElementById('chart')
	myChart = echarts.init(chartDom as HTMLElement)

	getData()
})

onBeforeMount(() => {
	if (myChart) myChart.dispose()
})

// 获取数据设置图表
function getData() {
	let option = {
		xAxis: {
			type: 'category',
			data: []
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				data: [],
				type: 'bar',
				showBackground: true,
				backgroundStyle: {
					color: 'rgba(180, 180, 180, 0.2)'
				}
			}
		]
	}
	myChart.showLoading()
	getStatistics3(current.value)
		.then((res) => {
			option.xAxis.data = res.data.data.x
			option.series[0].data = res.data.data.y
			option && myChart.setOption(option)
		})
		.finally(() => myChart.hideLoading())
}

// 监听容器大小变化更新图表
const el = ref(null)
useResizeObserver(el, () => {
	myChart.resize()
})
</script>

<template>
	<el-card class="mt-5">
		<template #header>
			<div class="flex justify-between">
				<span>订单统计</span>
				<div>
					<el-check-tag
						v-for="item in options"
						:key="item.text"
						:checked="item.value === current"
						style="margin-right: 8px"
						@click="handleChoose(item.value)"
					>
						{{ item.text }}
					</el-check-tag>
				</div>
			</div>
		</template>
		<div id="chart" ref="el" style="width: 100%; height: 300px"></div>
	</el-card>
</template>

<style lang="less" scoped></style>

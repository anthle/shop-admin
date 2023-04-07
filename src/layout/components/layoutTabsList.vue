<script setup lang="ts">
import { ref } from 'vue'

// let tabIndex = 2
const editableTabsValue = ref('2')
const editableTabs = ref([
	{
		title: 'Tab 1',
		name: '1',
		content: 'Tab 1 content'
	},
	{
		title: 'Tab 2',
		name: '2',
		content: 'Tab 2 content'
	},
	{
		title: 'Tab 3',
		name: '3',
		content: 'Tab 3 content'
	}
])

// const addTab = (targetName: string) => {
// 	const newTabName = `${++tabIndex}`
// 	editableTabs.value.push({
// 		title: 'New Tab',
// 		name: newTabName,
// 		content: 'New Tab content'
// 	})
// 	editableTabsValue.value = newTabName
// }
const removeTab = (targetName: any) => {
	const tabs = editableTabs.value
	let activeName = editableTabsValue.value
	if (activeName === targetName) {
		tabs.forEach((tab, index) => {
			if (tab.name === targetName) {
				const nextTab = tabs[index + 1] || tabs[index - 1]
				if (nextTab) {
					activeName = nextTab.name
				}
			}
		})
	}

	editableTabsValue.value = activeName
	editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>

<template>
	<div class="fixed top-[64px] h-[44px] flex items-center bg-gray-100 z-10">
		<el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" closable @tab-remove="removeTab">
			<el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name"> </el-tab-pane>
		</el-tabs>
		<span class="bg-white rounded flex justify-center items-center ml-auto">
			<el-dropdown>
				<span class="el-dropdown-link">
					<el-icon class="el-icon--right">
						<arrow-down />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item>Action 1</el-dropdown-item>
						<el-dropdown-item>Action 2</el-dropdown-item>
						<el-dropdown-item>Action 3</el-dropdown-item>
						<el-dropdown-item disabled>Action 4</el-dropdown-item>
						<el-dropdown-item divided>Action 5</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</span>
	</div>
</template>

<style lang="less" scoped>
.demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}
</style>

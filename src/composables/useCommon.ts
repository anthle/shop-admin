import type { FormInstance } from 'element-plus'
import type formDrawer from '@/components/formDrawer.vue'
import { toast } from '@/composables/useEle'
import type { Option, FormOption, Form } from '@/composables/types'

// 列表、搜索、分页
export function useInitTable(option: Option = {} as Option) {
	const tableData = ref()
	const loading = ref(false)
	const total = ref(0)
	const currentPage = ref()
	let searchForm: any = {}
	let resetSearchForm: any = () => {}

	if (option.searchForm) {
		searchForm = reactive({ ...option.searchForm })
		resetSearchForm = () => {
			for (const key in option.searchForm) {
				searchForm[key] = option.searchForm[key]
			}
			getData()
		}
	}

	const getData = (page: number = 1) => {
		currentPage.value = page
		loading.value = true
		option
			.getList(currentPage.value, searchForm)
			.then((res: any) => {
				if (option.onGetListSuccess && typeof option.onGetListSuccess === 'function') {
					option.onGetListSuccess(res)
				} else {
					tableData.value = res.data.data.list
					total.value = res.data.data.totalCount
				}
			})
			.finally(() => {
				loading.value = false
			})
	}

	//  删除管理员

	const handleDelete = (id: number | number[]) => {
		option.delete!(id).then(() => {
			toast('删除成功')
			getData(1)
		})
	}

	// 修改状态
	const handleChangeStatus = (status: any, row: any) => {
		if (!row.id) return

		row.statusLoading = true
		option.updateStatus!(row.id, status)
			.then(() => {
				toast('修改状态成功')
				row.status = status
			})
			.finally(() => {
				row.statusLoading = false
			})
	}

	// 多选选中id
	const multiSelectionIds = ref<number[]>([])
	const handleSelectionChange = (e: any) => {
		multiSelectionIds.value = e.map((o: any) => o.id)
	}

	// 批量删除
	const multipleTableRef = ref()
	const handleMultiDelete = () => {
		loading.value = true
		option.delete!(multiSelectionIds.value)
			.then(() => {
				toast('删除成功')
				if (multipleTableRef.value) {
					multipleTableRef.value.clearSelection()
				}
				multipleTableRef.value!.clearSelection()
				getData()
			})
			.finally(() => {
				loading.value = false
			})
	}

	//批量修改状态
	const handleMultiStatusChange = (status: number) => {
		loading.value = true
		option.updateStatus!(multiSelectionIds.value, status)
			.then(() => {
				toast('修改状态成功')
				if (multipleTableRef.value) {
					multipleTableRef.value.clearSelection()
				}
				multipleTableRef.value!.clearSelection()
				getData()
			})
			.finally(() => {
				loading.value = false
			})
	}

	getData()

	return {
		tableData,
		searchForm,
		loading,
		total,
		currentPage,
		resetSearchForm,
		getData,
		handleDelete,
		handleChangeStatus,
		handleSelectionChange,
		multipleTableRef,
		handleMultiDelete,
		handleMultiStatusChange,
		multiSelectionIds
	}
}

// 新增、修改
export function useInitForm(option: FormOption = {} as FormOption) {
	const isEdit = ref(false)
	const managerId = ref(0)

	const form: Form = reactive({})

	const rules = option.rules || {}

	const formRef = ref<FormInstance>()

	const formDrawerRef = ref<InstanceType<typeof formDrawer>>()

	const currentPage = option.currentPage.value

	const handleSubmit = () => {
		formRef.value?.validate((valid: boolean) => {
			if (!valid) return
			formDrawerRef.value?.showLoading()

			let body = {}
			if (option.beforeSubmit && typeof option.beforeSubmit === 'function') {
				body = option.beforeSubmit({ ...form })
			} else {
				body = form
			}
			const fun = isEdit.value ? option.update(managerId.value, body) : option.create(body)

			fun
				.then(() => {
					toast(title.value + '成功')
					option.getData(isEdit.value ? currentPage : 1)
					formDrawerRef.value?.close()
				})
				.finally(() => {
					formDrawerRef.value?.hideLoading()
				})
		})
	}

	const resetForm = (row: any) => {
		if (row) {
			for (const key in row) {
				form[key] = row[key]
			}
		}
	}

	// 新增管理员
	const handleCreate = () => {
		isEdit.value = false
		formDrawerRef.value?.open()
		resetForm(option.form)
	}

	// 修改管理员
	const handleUpdate = (row: any) => {
		isEdit.value = true
		formDrawerRef.value?.open()
		resetForm(row)
		managerId.value = row.id
	}

	const title = computed(() => {
		return isEdit.value ? '修改' : '新增'
	})

	return {
		form,
		rules,
		formRef,
		formDrawerRef,
		handleSubmit,
		handleCreate,
		handleUpdate,
		title
	}
}

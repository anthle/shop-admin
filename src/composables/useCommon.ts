import type { FormInstance } from 'element-plus'
import type formDrawer from '@/components/formDrawer.vue'
import { toast } from '@/composables/useEle'
import type { Option, FormOption, Form } from '@/composables/types'

// 列表、搜索、分页
export function useInitTable(option: Option = {} as Option) {
	const tableData = ref([{}])
	const loading = ref(false)
	const total = ref(0)
	const currentPage = ref()
	let serachForm: any = {}
	let resetSearchForm: any = () => {}

	if (option.searchForm) {
		serachForm = reactive({ ...option.searchForm })
		resetSearchForm = () => {
			for (const key in option.searchForm) {
				serachForm[key] = option.searchForm[key]
			}
			getData()
		}
	}

	const getData = (page: number = 1) => {
		currentPage.value = page
		loading.value = true
		option
			.getList(currentPage.value, serachForm)
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

	const handleDelete = (id: number) => {
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

	getData()

	return {
		tableData,
		serachForm,
		loading,
		total,
		currentPage,
		resetSearchForm,
		getData,
		handleDelete,
		handleChangeStatus
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
			const fun = isEdit.value ? option.update(managerId.value, form) : option.create(form)

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
	const handleUpdateNotice = (row: any) => {
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
		handleUpdateNotice,
		title
	}
}

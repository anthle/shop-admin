interface Option {
	getList: (page: number, serachForm?: any) => Promise<any>
	onGetListSuccess?: (res: any) => void
	delete?: (id: number | number[]) => Promise<any>
	updateStatus?: (id: number, status: number) => Promise<any>
	searchForm?: any
}

interface FormOption {
	create: (form: any) => Promise<any>
	update: (id: number, form: any) => Promise<any>
	getData: (page: number) => void
	form: any
	currentPage: any
	rules?: any
	beforeSubmit?: (res: any) => any
}

interface Form {
	[key: string]: any
}

export type { Option, FormOption, Form }

import {
	createGoodsSkusCard,
	updateGoodsSkusCard,
	deleteGoodsSkusCard,
	sortGoodsSkusCard,
	createGoodsSkusCardValue,
	updateGoodsSkusCardValue,
	deleteGoodsSkusCardValue,
	chooseAndSetGoodsSkusCard
} from '@/service/main/goods'
import { useArrayMoveDown, useArrayMoveUp } from '@/composables/utils'
import type { ElInput } from 'element-plus'
import { cartesianProductOf } from '@/composables/utils'

export const goodsId = ref(0)
export const sku_card_list = ref()
export const sku_list = ref()
// 初始化规格选项的值
export function initSkuCardList(d: any) {
	sku_card_list.value = d.goodsSkusCard.map((item: any) => {
		item.text = item.name
		item.loading = false
		item.goodsSkusCardValue.map((v: any) => {
			v.text = v.value || '属性值'
			return v
		})
		return item
	})
	sku_list.value = d.goodsSkus
}

// 添加规格选项
export const btnLoading = ref(false)
export function addSkuCardEvent() {
	btnLoading.value = true
	createGoodsSkusCard({
		goods_id: goodsId.value,
		name: '规格名称',
		order: 50,
		type: 0
	})
		.then((res) => {
			sku_card_list.value.push({
				...res,
				text: res.data.data.name,
				loading: false,
				goodsSkusCardValue: []
			})
			btnLoading.value = false
		})
		.finally(() => (btnLoading.value = false))
}

// 修改规格选项
export function handleUpdate(item: any) {
	item.loading = true
	updateGoodsSkusCard(item.id, {
		goods_id: item.goods_id, //商品ID
		name: item.text, //规格名称
		order: item.order, //排序
		type: 0 //规格类型 0文字
	})
		.then(() => {
			item.name = item.text
		})
		.catch(() => {
			item.text = item.name
		})
		.finally(() => {
			item.loading = false
		})
}

// 删除规格选项
export function handleDelete(item: any) {
	item.loading = true
	deleteGoodsSkusCard(item.id).then(() => {
		const i = sku_card_list.value.findIndex((o: any) => o.id === item.id)
		if (i != -1) {
			sku_card_list.value.splice(i, 1)
		}
		getTableData()
	})
}

// 更改规格选择
export function handleChooseSetGoodsSkusCard(id: number, data: any) {
	const item = sku_card_list.value.find((o: any) => o.id == id)
	item.loading = true
	chooseAndSetGoodsSkusCard(id, data)
		.then((res) => {
			item.name = item.text = res.data.data.goods_skus_card.name
			item.goodsSkusCardValue = res.data.data.goods_skus_card_value.map((o: any) => {
				o.text = o.value || '属性值'
				return o
			})
			getTableData()
		})
		.finally(() => {
			item.loading = false
		})
}
// 初始化规格的值
export function initSkusCardItem(id: number) {
	const item = sku_card_list.value.find((o: any) => o.id === id)
	const inputValue = ref('')
	const inputVisible = ref(false)
	const InputRef = ref<InstanceType<typeof ElInput>>()

	const handleClose = (tag: any) => {
		loading.value = true
		deleteGoodsSkusCardValue(tag.id)
			.then(() => {
				const i = item.goodsSkusCardValue.findIndex((o: any) => o.id === tag.id)
				if (i != -1) {
					item.goodsSkusCardValue.splice(i, 1)
				}
				getTableData()
			})
			.finally(() => {
				loading.value = false
			})
	}

	const showInput = () => {
		inputVisible.value = true
		nextTick(() => {
			InputRef.value!.input!.focus()
		})
	}

	const loading = ref(false)
	const handleInputConfirm = () => {
		if (!inputValue.value) {
			inputVisible.value = false
			return
		}

		loading.value = true

		createGoodsSkusCardValue({
			goods_skus_card_id: id, //规格ID
			name: item.name, //规格名称
			order: 50, //排序
			value: inputValue.value //规格选项名称
		})
			.then((res) => {
				item.goodsSkusCardValue.push({
					...res.data.data,
					text: res.data.data.value
				})
				getTableData()
			})
			.finally(() => {
				inputVisible.value = false
				inputValue.value = ''
				loading.value = false
			})
	}
	const handleChange = (value: any, tag: any) => {
		loading.value = true
		updateGoodsSkusCardValue(tag.id, {
			goods_skus_card_id: id, //规格ID
			name: item.name, //规格名称
			order: tag.order, //排序
			value: value //规格选项名称
		})
			.then(() => {
				tag.value = value
				getTableData()
			})
			.catch(() => {
				tag.text = tag.value
			})
			.finally(() => (loading.value = false))
	}
	return { item, inputValue, inputVisible, InputRef, showInput, handleInputConfirm, handleClose, loading, handleChange }
}

// 规格排序
export const bodyLoading = ref(false)
export function sortCard(action: string, index: number) {
	const oList = JSON.parse(JSON.stringify(sku_card_list.value))
	const func = action === 'up' ? useArrayMoveUp : useArrayMoveDown
	func(oList, index)
	const sortdata = oList.map((o: any, i: number) => {
		return {
			id: o.id,
			order: i + 1
		}
	})
	bodyLoading.value = true
	sortGoodsSkusCard({
		sortdata
	})
		.then(() => {
			func(sku_card_list.value, index)
			getTableData()
		})
		.finally(() => {
			bodyLoading.value = false
		})
}

export function initSkuTable() {
	const skuLabels = computed(() => {
		return sku_card_list.value.filter((v: any) => {
			return v.goodsSkusCardValue.length > 0
		})
	})
	// 获取表头
	const tableThs = computed(() => {
		const length = skuLabels.value.length
		return [
			{
				name: '商品规格',
				colspan: length,
				width: '',
				rowspan: length > 0 ? 1 : 2
			},
			{
				name: '销售价',
				width: '100',
				rowspan: 2
			},
			{
				name: '市场价',
				width: '100',
				rowspan: 2
			},
			{
				name: '成本价',
				width: '100',
				rowspan: 2
			},
			{
				name: '库存',
				width: '100',
				rowspan: 2
			},
			{
				name: '体积',
				width: '100',
				rowspan: 2
			},
			{
				name: '重量',
				width: '100',
				rowspan: 2
			},
			{
				name: '编码',
				width: '100',
				rowspan: 2
			}
		]
	})

	return {
		skuLabels,
		tableThs,
		sku_list
	}
}

// 动态规格设置
function getTableData() {
	setTimeout(() => {
		if (sku_card_list.value.length === 0) return []

		const list: any = []
		sku_card_list.value.forEach((o: any) => {
			if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
				list.push(o.goodsSkusCardValue)
			}
		})

		if (list.length == 0) {
			return []
		}

		const arr = cartesianProductOf(...list)

		// sku_list.value = []
		sku_list.value = arr.map((o) => {
			return {
				code: '',
				cprice: '',
				goods_id: goodsId.value,
				image: '',
				oprice: '0.00',
				pprice: '0.00',
				skus: o,
				stock: 0,
				volume: 0,
				weight: 0
			}
		})
	}, 200)
}

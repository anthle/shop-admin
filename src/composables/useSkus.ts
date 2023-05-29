import {
	createGoodsSkusCard,
	updateGoodsSkusCard,
	deleteGoodsSkusCard,
	sortGoodsSkusCard,
	createGoodsSkusCardValue,
	updateGoodsSkusCardValue,
	deleteGoodsSkusCardValue
} from '@/service/main/goods'
import { useArrayMoveDown, useArrayMoveUp } from '@/composables/utils'
import type { ElInput } from 'element-plus'

export const goodsId = ref(0)
export const sku_card_list = ref()
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
	})
}
// 初始化规格的值
export function initSkusCardItem(id: number) {
	const item = sku_card_list.value.find((o: any) => o.id === id)
	const inputValue = ref('')
	const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
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
		})
		.finally(() => {
			bodyLoading.value = false
		})
}

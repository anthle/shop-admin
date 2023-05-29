import { createGoodsSkusCard } from '@/service/main/goods'

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

// 初始化规格的值
export function initSkusCardItem(id: number) {
	const item = sku_card_list.value.find((o: any) => o.id === id)
	return item
}

export interface Form {
	distribution_open: number //分销启用:0禁用1启用
	store_first_rebate: number //一级返佣比例：0~100
	store_second_rebate: number //二级返佣比例：0~100
	spread_banners: string[] //分销海报图
	is_self_brokerage: number //自购返佣:0否1是
	settlement_days: number //结算时间（单位：天）
	brokerage_method: string //佣金到账方式:hand手动,wx微信
}

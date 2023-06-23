export interface BaseForm {
	open_reg: number
	reg_method: string
	password_min: number
	password_encrypt: number[]
	upload_method: string
	upload_config: {
		Bucket: string
		ACCESS_KEY: string
		SECRET_KEY: string
		http: string
	}
	api_safe: number
	api_secret: string
	close_order_minute: number
	auto_received_day: number
	after_sale_day: number
}

export interface BuyForm {
	close_order_minute: number
	auto_received_day: number
	after_sale_day: number
	alipay: {
		app_id: string
		ali_public_key: string
		private_key: string
	}
	wxpay: {
		app_id: string
		miniapp_id: string
		secret: string
		appid: string
		mch_id: string
		key: string
		cert_client: string
		cert_key: string
	}
}

export interface ShipForm {
	ship: string
	[key: string]: string
}

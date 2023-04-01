import type { AnyObject } from 'env'

export interface StoreState {
	userInfo: AnyObject
}

const initState = (key: string, defaultVal: any, parse = true) => {
	return localStorage[key] ? (parse ? JSON.parse(localStorage[key]) : localStorage[key]) : defaultVal
}

const state: StoreState = {
	userInfo: initState('userinfo', {})
}

export default state

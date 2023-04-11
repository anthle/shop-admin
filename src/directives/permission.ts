import type { App } from 'vue'
import { useLoginStore } from '@/stores/login'
import { storeToRefs } from 'pinia'

function hasPermission(val: any, el: any = false) {
	if (!Array.isArray(val)) {
		throw new Error('permission value must be an array')
	}
	const loginStore = useLoginStore()
	const { userInfo } = storeToRefs(loginStore)
	const ruleNames = userInfo.value.ruleNames

	const hasAuth = !!val.find((v) => ruleNames.includes(v))
	if (!hasAuth && el) {
		el.parentNode && el.parentNode.removeChild(el)
	}

	return hasAuth
}

export default function Permission(app: App) {
	app.directive('permission', {
		mounted(el, binding) {
			hasPermission(binding.value, el)
		}
	})
}

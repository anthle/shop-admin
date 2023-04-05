import { createPinia } from 'pinia'
import type { App } from 'vue'
import { useLoginStore } from './login'

const pinia = createPinia()

function registerStore(app: App) {
	app.use(pinia)
	const loginStore = useLoginStore()
	loginStore.loadlocalCacheAction()
}

export default registerStore

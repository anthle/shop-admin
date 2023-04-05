import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import 'normalize.css'
import './index.css'
import 'nprogress/nprogress.css'
import registerIcons from '@/global/registre-icon'
import pinia from '@/stores'

const app = createApp(App)

app.use(registerIcons)
app.use(pinia)
app.use(router)

app.mount('#app')

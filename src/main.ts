import { createApp } from 'vue'
import App from './App.vue'
import ws from '@/plugins/ws'

import router from '@/router'
import vuetify from '@/plugins/vuetify'
import { toastify, toastifyGlobalOptions } from '@/plugins/toastify'

import '@/styles/common.scss'

ws.init()

createApp(App)
    .use(router)
    .use(vuetify)
    .use(toastify, toastifyGlobalOptions)
    .mount('#app')

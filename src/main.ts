import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router'
import vuetify from '@/plugins/vuetify'
import socket from '@/plugins/socket'
import { toastify, toastifyGlobalOptions } from '@/plugins/toastify'

import '@/styles/common.scss'

createApp(App)
    .use(router)
    .use(vuetify)
    .use(toastify, toastifyGlobalOptions)
    .mount('#app')

socket.connect()

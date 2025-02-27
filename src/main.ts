import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router'
import vuetify from '@/plugins/vuetify'
import pinia from '@/plugins/pinia'
import { toastify, toastifyGlobalOptions } from '@/plugins/toastify'

import '@/styles/variables.css'
import '@/styles/common.scss'

createApp(App)
    .use(pinia)
    .use(router)
    .use(vuetify)
    .use(toastify, toastifyGlobalOptions)
    .mount('#app')

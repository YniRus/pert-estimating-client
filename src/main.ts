import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router'
import vuetify from '@/plugins/vuetify/vuetify'
import pinia from '@/plugins/pinia'
import { toastify, toastifyGlobalOptions } from '@/plugins/toastify/toastify'

import '@/styles/variables.css'
import '@/styles/fonts.css'
import '@/styles/common.scss'
import '@/styles/utility.scss'

createApp(App)
    .use(pinia)
    .use(router)
    .use(vuetify)
    .use(toastify, toastifyGlobalOptions)
    .mount('#app')

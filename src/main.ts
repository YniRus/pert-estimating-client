import { createApp } from 'vue'
import App from './App.vue'
import ws from '@/plugins/ws'

import router from '@/router'
import vuetify from '@/plugins/vuetify'
import pinia from '@/plugins/pinia'
import { toastify, toastifyGlobalOptions } from '@/plugins/toastify'
import { vuetifyDialog, vuetifyDialogGlobalOptions } from '@/plugins/vuetify-dialog'

import '@/styles/variables.css'
import '@/styles/common.scss'

ws.init()

createApp(App)
    .use(pinia)
    .use(router)
    .use(vuetify)
    .use(vuetifyDialog, {
        confirmDialog: vuetifyDialogGlobalOptions,
    })
    .use(toastify, toastifyGlobalOptions)
    .mount('#app')

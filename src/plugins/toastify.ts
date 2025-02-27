import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const toastify = Vue3Toastify
export const toastifyGlobalOptions = {
    theme: 'auto',
    autoClose: 2000,
    position: 'top-right',
} as ToastContainerOptions

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import ws from '@/plugins/ws'

export enum AppErrorCode {
    AnotherAuth = 1,
}

export const useAppStore = defineStore('app', () => {
    const error = ref<AppErrorCode>()

    watch(error, () => {
        if (!error.value) return
        ws.emit('mutation:disconnect', isSilentDisconnect(error.value))
    })

    function isSilentDisconnect(error: AppErrorCode) {
        switch (error) {
            case AppErrorCode.AnotherAuth: return true
            default: return false
        }
    }

    function $reset() {
        error.value = undefined
    }

    return {
        $reset,
        error,
    }
})

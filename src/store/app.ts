import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import ws from '@/plugins/ws'
import { useRouter } from 'vue-router'
import RouteName from '@/router/route-name'

export enum AppErrorCode {
    AnotherAuth = 1,
    AuthTokenChanged,
    AuthTokenRemoved,
}

export const useAppStore = defineStore('app', () => {
    const error = ref<AppErrorCode>()

    const router = useRouter()

    watch(error, () => {
        if (!error.value) return
        ws.emit('mutation:disconnect', isSilentDisconnect(error.value))
        handleRouteOnError(error.value)
    })

    function handleRouteOnError(error: AppErrorCode) {
        switch (error) {
            case AppErrorCode.AuthTokenRemoved: {
                router.push({ name: RouteName.Home })
            }
        }
    }

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

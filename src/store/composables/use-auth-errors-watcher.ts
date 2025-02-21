import { useAuthStore } from '@/store/auth'
import ws from '@/plugins/ws'
import type { User } from '@/definitions/user'
import { AppErrorCode, useAppStore } from '@/store/app'

export function useAuthErrorsWatcher() {
    const appStore = useAppStore()
    const authStore = useAuthStore()

    function onUserConnected(user: User) {
        if (authStore.data?.user.id === user.id) {
            appStore.error = AppErrorCode.AnotherAuth
        }
    }

    function watch() {
        ws.on('on:user-connected', onUserConnected)
    }

    function unwatch() {
        ws.off('on:user-connected', onUserConnected)
    }

    return {
        watch,
        unwatch,
    }
}

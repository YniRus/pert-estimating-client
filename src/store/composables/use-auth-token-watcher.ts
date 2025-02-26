import { AppErrorCode, useAppStore } from '@/store/app'
import { useCookies } from '@vueuse/integrations/useCookies'
import type { CookieChangeOptions } from 'universal-cookie'
import { type MaybeRefOrGetter, toValue } from 'vue'

export function useAuthTokenWatcher(isLeaveLoading: MaybeRefOrGetter<boolean>) {
    const appStore = useAppStore()

    const { addChangeListener, removeChangeListener } = useCookies(['authToken'], {
        doNotParse: true,
        autoUpdateDependencies: true,
    })

    function onAuthTokenChanged(options: CookieChangeOptions) {
        if (toValue(isLeaveLoading) && !options.value) {
            // Ожидаемое поведение. Токен авторизации очистился при выходе из комнаты
            return
        }

        appStore.error = options.value
            ? AppErrorCode.AuthTokenChanged
            : AppErrorCode.AuthTokenRemoved
    }

    function watch() {
        addChangeListener(onAuthTokenChanged)
    }

    function unwatch() {
        removeChangeListener(onAuthTokenChanged)
    }

    return {
        watch,
        unwatch,
    }
}

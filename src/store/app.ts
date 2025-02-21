import { defineStore } from 'pinia'
import { ref } from 'vue'

export enum AppErrorCode {
    AnotherAuth = 1,
}

export const useAppStore = defineStore('app', () => {
    const error = ref<AppErrorCode>()

    function $reset() {
        error.value = undefined
    }

    return {
        $reset,
        error,
    }
})

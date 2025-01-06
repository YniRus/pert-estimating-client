import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthData } from '@/definitions/auth'
import ws from '@/plugins/ws'
import { WSError } from '@/utils/ws-error'

export const useAuthStore = defineStore('auth', () => {
    const data = ref<AuthData>()

    async function auth() {
        const response = await ws.emitWithAck('query:auth')

        if (response instanceof WSError) return response

        data.value = response
    }

    function $reset() {
        data.value = undefined
    }

    return {
        $reset,
        data,
        auth,
    }
})

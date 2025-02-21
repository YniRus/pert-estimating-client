import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthData } from '@/definitions/auth'
import type { User } from '@/definitions/user'
import { FetchError, request } from '@/plugins/ofetch'

export const useAuthStore = defineStore('auth', () => {
    const data = ref<AuthData>()

    async function auth() {
        const response = await request.get<AuthData>('auth')

        if (response instanceof FetchError) return response

        data.value = response
    }

    function isAuthUser(user: User) {
        return user.id === data.value?.user.id
    }

    function $reset() {
        data.value = undefined
    }

    return {
        $reset,
        data,
        auth,
        isAuthUser,
    }
})

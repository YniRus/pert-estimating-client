import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Room } from '@/definitions/room'
import type { UID } from '@/definitions/aliases'
import ws from '@/plugins/ws'
import { WSError } from '@/utils/ws-error'
import type { User } from '@/definitions/user'

export const useRoomStore = defineStore('room', () => {
    const data = ref<Room>()

    async function init(roomId: UID) {
        const response = await ws.emitWithAck('query:room', roomId)

        if (response instanceof WSError) return response

        data.value = response
    }

    async function wsOn() {
        ws.on('on:user-connected', (user: User) => {
            if (!data.value) return

            data.value.users.push(user)
        })

        ws.on('on:user-disconnected', (userId: UID) => {
            if (!data.value) return

            data.value.users = data.value.users.filter((user) => user.id !== userId)
        })
    }

    function $reset() {
        data.value = undefined
    }

    return {
        $reset,
        data,
        init,
        wsOn,
    }
})

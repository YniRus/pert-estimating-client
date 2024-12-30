import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Room } from '@/definitions/room'
import ws from '@/plugins/ws'
import { WSError } from '@/utils/ws-error'

export const useRoomStore = defineStore('room', () => {
    const data = ref<Room>()

    async function init() {
        const response = await ws.emitWithAck('query:auth')

        if (response instanceof WSError) return

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

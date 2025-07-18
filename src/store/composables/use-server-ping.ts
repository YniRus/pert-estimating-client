import { ref } from 'vue'
import { request } from '@/plugins/ofetch'

export function useServerPing() {
    const interval = import.meta.env.VITE_SERVER_PING_INTERVAL
        ? +import.meta.env.VITE_SERVER_PING_INTERVAL
        : null
    const intervalId = ref<ReturnType<typeof setInterval>>()

    const isServerPingEnabled = Number.isInteger(interval)

    async function ping() {
        await request.post('/ping')
    }

    function pingOn() {
        if (!isServerPingEnabled) return
        intervalId.value = setInterval(ping, interval!)
    }

    function pingOff() {
        clearInterval(intervalId.value)
    }

    return {
        isServerPingEnabled,
        pingOn,
        pingOff,
    }
}

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useUserEstimatesNotificationStore } from '@/store/user-estimates-notification'

export const useLastEstimateTimerStore = defineStore('last-estimate-timer', () => {
    const userEstimatesNotificationStore = useUserEstimatesNotificationStore()

    const isEnabled = ref(false)
    const isRunning = ref(false)

    const seconds = ref(0)

    const intervalId = ref<number | null>(null)

    function start() {
        if (isRunning.value) stop()

        isRunning.value = true
        seconds.value = 0

        intervalId.value = window.setInterval(() => {
            seconds.value++
            if (seconds.value >= userEstimatesNotificationStore.timerTimeout) stop()
        }, 1000)
    }

    function stop() {
        if (!isRunning.value) return

        if (intervalId.value !== null) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }

        isRunning.value = false
        seconds.value = 0
    }

    watch(isEnabled, () => {
        if (!isEnabled.value) stop()
    })

    return {
        isEnabled,
        isRunning,
        seconds,
        start,
        stop,
    }
})

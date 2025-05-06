import { spawnBubbleNotification } from '@/utils/bubble-notifications'
import { useUserEstimatesNotificationStore } from '@/store/user-estimates-notification'
import type { User } from '@/definitions/user'
import { useLastEstimateTimerStore } from '@/store/last-estimate-timer'
import { watchEffect } from 'vue'
import { useRoomStore } from '@/store/room'

export function useUserEstimatesNotifications() {
    const roomStore = useRoomStore()
    const userEstimatesNotificationStore = useUserEstimatesNotificationStore()
    const lastEstimateTimerStore = useLastEstimateTimerStore()

    function onUserEstimates(user: User) {
        notifyUserEstimate(user)
        triggerLastEstimateTimer()
    }

    function notifyUserEstimate(user: User) {
        if (!userEstimatesNotificationStore.isEnabled) return
        spawnBubbleNotification({ text: user.name })
    }

    function triggerLastEstimateTimer() {
        if (!userEstimatesNotificationStore.isEnabled) return
        if (!lastEstimateTimerStore.isEnabled) return
        lastEstimateTimerStore.start()
    }

    watchEffect(() => {
        const isEstimatesVisible = roomStore.data?.estimatesVisible
        const isEnabled = userEstimatesNotificationStore.isEnabled
        const isTimerEnabled = userEstimatesNotificationStore.isTimerEnabled
        lastEstimateTimerStore.isEnabled = isEnabled && isTimerEnabled && !isEstimatesVisible
    })

    return {
        onUserEstimates,
        triggerLastEstimateTimer,
    }
}

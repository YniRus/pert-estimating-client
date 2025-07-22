import { useAuthStore } from '@/store/auth'
import { useRoomStore } from '@/store/room'
import { computed } from 'vue'
import type { Estimate, Estimates } from '@/definitions/estimates'
import { EstimateType } from '@/definitions/estimates'
import { useRoomConfig } from '@/store/composables/use-room-config'

export function useAuthUserEstimates() {
    const authStore = useAuthStore()
    const roomStore = useRoomStore()
    const { withConfirmEstimates } = useRoomConfig()

    const roomAuthUserIndex = computed(() => {
        if (!roomStore.data || !authStore.data) return -1
        return roomStore.data.users.findIndex((user) => user.id === authStore.data!.user.id)
    })

    const authUserEstimates = computed<Estimates>(() => {
        if (!roomStore.data || !authStore.data || roomAuthUserIndex.value === -1) return {}
        return roomStore.data.users[roomAuthUserIndex.value].estimates.estimates || {}
    })

    function setAuthUserEstimate(type: EstimateType, estimate: Estimate) {
        if (!roomStore.data || !authStore.data || roomAuthUserIndex.value === -1) return

        roomStore.data.users[roomAuthUserIndex.value].estimates.estimates[type] = estimate
    }

    const authUserEstimatesConfirmed = computed(() => {
        if (!withConfirmEstimates.value) return false
        if (!roomStore.data || !authStore.data || roomAuthUserIndex.value === -1) return false
        return roomStore.data.users[roomAuthUserIndex.value].estimates.confirmed ?? false
    })

    function setAuthUserEstimatesConfirmed(confirmed: boolean) {
        if (!withConfirmEstimates.value) return
        if (!roomStore.data || !authStore.data || roomAuthUserIndex.value === -1) return

        roomStore.data.users[roomAuthUserIndex.value].estimates.confirmed = confirmed
    }

    return {
        authUserEstimates,
        setAuthUserEstimate,
        authUserEstimatesConfirmed,
        setAuthUserEstimatesConfirmed,
    }
}

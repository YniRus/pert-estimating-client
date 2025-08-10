import { computed } from 'vue'
import { useRoomConfig } from '@/store/composables/use-room-config'
import { useRoomStore } from '@/store/room'
import { isUserHasUnconfirmedEstimates } from '@/utils/estimates-confirm'

export function useRoomEstimatesConfirm() {
    const roomStore = useRoomStore()
    const { withConfirmEstimates } = useRoomConfig()

    const isRoomHasUnconfirmedEstimates = computed(() => {
        if (!withConfirmEstimates.value) return false
        return roomStore.data?.users.some(isUserHasUnconfirmedEstimates)
    })

    return {
        isRoomHasUnconfirmedEstimates,
    }
}

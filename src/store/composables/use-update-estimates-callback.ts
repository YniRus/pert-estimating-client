import { useEstimatesConfirmStore } from '@/store/estimates-confirm'
import { useRoomConfig } from '@/store/composables/use-room-config'

export function useUpdateEstimatesCallback() {
    const estimatesConfirmStore = useEstimatesConfirmStore()
    const { withConfirmEstimates } = useRoomConfig()

    function onSetAuthUserEstimates() {
        if (withConfirmEstimates.value) {
            estimatesConfirmStore.onSetAuthUserEstimates()
        }
    }

    return {
        onSetAuthUserEstimates,
    }
}

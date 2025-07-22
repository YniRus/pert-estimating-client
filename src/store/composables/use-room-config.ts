import { computed } from 'vue'
import { useRoomStore } from '@/store/room'
import { defaultEstimateVariants } from '@/utils/estimate/values'

export function useRoomConfig() {
    const roomStore = useRoomStore()

    const estimateVariants = computed(() => {
        return roomStore.data?.config?.estimateVariants || defaultEstimateVariants
    })

    const withConfirmEstimates = computed(() => {
        return roomStore.data?.config?.withConfirmEstimates
    })

    return {
        estimateVariants,
        withConfirmEstimates,
    }
}

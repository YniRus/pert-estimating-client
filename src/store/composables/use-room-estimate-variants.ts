import { computed } from 'vue'
import { isNumber } from '@/utils/utils'
import { useRoomConfig } from '@/store/composables/use-room-config'

export function useRoomEstimateVariants() {
    const { estimateVariants } = useRoomConfig()

    const estimateValues = computed(() => {
        return estimateVariants.value.filter(isNumber)
    })

    return {
        estimateVariants,
        estimateValues,
    }
}

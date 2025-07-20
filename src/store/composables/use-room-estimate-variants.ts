import { computed } from 'vue'
import { useRoomStore } from '@/store/room'
import { baseEstimateValues, nonValueUnitEstimateVariants } from '@/utils/estimate/values'
import { isNumber } from '@/utils/utils'
import type { EstimateVariant } from '@/definitions/estimates'

export function useRoomEstimateVariants() {
    const roomStore = useRoomStore()

    const estimateVariants = computed(() => {
        return roomStore.data?.config?.estimateVariants || defaultEstimateVariants
    })

    const defaultEstimateVariants: EstimateVariant[] = [
        ...nonValueUnitEstimateVariants,
        ...baseEstimateValues,
    ]

    const estimateValues = computed(() => {
        return estimateVariants.value.filter(isNumber)
    })

    return {
        estimateVariants,
        defaultEstimateVariants,
        estimateValues,
    }
}

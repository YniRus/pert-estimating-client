import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type EstimatesOrder, EstimateType } from '@/definitions/estimates'

export const useEstimatesOrderStore = defineStore('estimates-strategy', () => {
    const order = ref(getDefaultOrder())

    function getDefaultOrder(): EstimatesOrder {
        return [EstimateType.Min, EstimateType.Probable, EstimateType.Max]
    }

    // TODO: New Feature - кастомные order с хранением в localStorage

    function resetIncorrectOrder() {
        order.value = getDefaultOrder()
    }

    function $reset() {
        order.value = getDefaultOrder()
    }

    return {
        $reset,
        order,
        getDefaultOrder,
        resetIncorrectOrder,
    }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    type Estimates,
    type EstimatesOrder,
    EstimateType,
    EstimateUnit,
    type EstimateValue,
} from '@/definitions/estimates'

export const useEstimatesStore = defineStore('estimates', () => {
    const type = ref(EstimateType.Probable)
    const unit = ref(EstimateUnit.Hours)
    const estimates = ref<Estimates>({})

    function setUnit(_unit: EstimateUnit) {
        unit.value = _unit
    }

    function setCurrentType(_type: EstimateType) {
        type.value = _type
    }

    function setNextType(order: EstimatesOrder) {
        const currentTypeIndex = order.indexOf(type.value)
        if (currentTypeIndex === -1) return // TODO: Ошибка стратегии. такого не должно быть

        let nextTypeIndex = currentTypeIndex + 1
        if (nextTypeIndex > order.length - 1) nextTypeIndex = 0

        setCurrentType(order[nextTypeIndex])
    }

    function setEstimate(value: EstimateValue) {
        estimates.value[type.value] = {
            value,
            unit: unit.value,
        }
    }

    function setEstimates(_estimates: Estimates) {
        estimates.value = _estimates
    }

    function $reset() {
        type.value = EstimateType.Probable
        unit.value = EstimateUnit.Hours
    }

    return {
        $reset,
        type,
        setCurrentType,
        setNextType,
        unit,
        setUnit,
        estimates,
        setEstimate,
        setEstimates,
    }
})

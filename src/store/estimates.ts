import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    type Estimate,
    type Estimates,
    type EstimatesOrder,
    EstimateType,
    EstimateUnit,
} from '@/definitions/estimates'
import ws from '@/plugins/ws'

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
        if (currentTypeIndex === -1) return // TODO: Ошибка в order. такого не должно быть

        let nextTypeIndex = currentTypeIndex + 1
        if (nextTypeIndex > order.length - 1) nextTypeIndex = 0

        setCurrentType(order[nextTypeIndex])
    }

    function setEstimate(value: number, customUnit?: EstimateUnit) {
        const estimate: Estimate = {
            value,
            unit: customUnit || unit.value,
        }

        console.log(estimates.value)

        estimates.value[type.value] = estimate

        ws.emit('mutation:estimate', type.value, estimate)
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

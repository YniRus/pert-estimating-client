import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import {
    type Estimate,
    type UserEstimate,
    type Estimates,
    type EstimatesOrder,
    EstimateType,
    EstimateUnit,
} from '@/definitions/estimates'
import ws from '@/plugins/ws'
import { useEstimatesOrderStore } from '@/store/estimates-order'
import { WSError } from '@/utils/ws-error'
import { isNonValueUnitEstimate } from '@/utils/estimate'

export const useEstimatesStore = defineStore('estimates', () => {
    const estimatesOrderStore = useEstimatesOrderStore()

    const type = ref(getDefaultType())
    const unit = ref(EstimateUnit.Hours)
    const estimates = ref<Estimates>({})

    function setUnit(_unit: EstimateUnit) {
        unit.value = _unit
    }

    function getDefaultType() {
        const [defaultType] = estimatesOrderStore.order
        return defaultType
    }

    watch(() => estimatesOrderStore.order, () => {
        if (!estimatesOrderStore.order.includes(type.value)) {
            type.value = getDefaultType()
        }
    })

    function setCurrentType(_type: EstimateType) {
        type.value = _type
    }

    function setNextType(order: EstimatesOrder) {
        const currentTypeIndex = order.indexOf(type.value)
        if (currentTypeIndex === -1) {
            // Ошибка в структуре order. Сбрасываем order к настройкам по умолчанию
            estimatesOrderStore.resetIncorrectOrder()
            order = estimatesOrderStore.order
        }

        let nextTypeIndex = currentTypeIndex + 1
        if (nextTypeIndex > order.length - 1) nextTypeIndex = 0

        setCurrentType(order[nextTypeIndex])
    }

    async function setEstimate(userEstimate: UserEstimate) {
        const estimate: Estimate = isNonValueUnitEstimate(userEstimate)
            ? userEstimate
            : { value: userEstimate.value, unit: userEstimate.unit || unit.value }

        estimates.value[type.value] = estimate

        const response = await ws.emitWithAck('mutation:estimate', type.value, estimate)
        if (response instanceof WSError) return response
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

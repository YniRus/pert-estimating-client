import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
    type EstimatesOrder,
    type EstimatesOrderData,
    EstimateType,
} from '@/definitions/estimates'
import {
    getStoredEstimatesOrderDataIfValid,
    setEstimatesOrderDataToStorage,
} from '@/utils/estimates-order-data'

export const useEstimatesOrderStore = defineStore('estimates-order', () => {
    const data = ref(getInitialOrderData())

    const order = computed<EstimatesOrder>(() => getOrderByData(data.value))

    function getOrderByData(data: EstimatesOrderData) {
        return data
            .filter((item) => !item.disabled)
            .map(({ type }) => type)
    }

    function getInitialOrderData() {
        return getStoredEstimatesOrderDataIfValid() || getDefaultOrderData()
    }

    function getDefaultOrderData(): EstimatesOrderData {
        return Object.values(EstimateType).map((type) => ({ type }))
    }

    function updateOrderData(_data: EstimatesOrderData) {
        data.value = _data
        setEstimatesOrderDataToStorage(_data)
    }

    function $reset() {
        data.value = getDefaultOrderData()
    }

    return {
        $reset,
        data,
        order,
        updateOrderData,
    }
})

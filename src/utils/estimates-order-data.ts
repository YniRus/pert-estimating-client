import { type EstimatesOrderData, EstimateType } from '@/definitions/estimates'

const estimatesOrderStorageKey = 'PERT-estimating_estimates-order'

export function getStoredEstimatesOrderDataIfValid() {
    const storageValue = localStorage.getItem(estimatesOrderStorageKey)
    if (!storageValue) return null

    try {
        const order = JSON.parse(storageValue)
        if (!isValidEstimatesOrderData(order)) return null

        return order
    } catch {
        return null
    }
}

function isValidEstimatesOrderData(maybeEstimatesOrderData: unknown): maybeEstimatesOrderData is EstimatesOrderData {
    if (!Array.isArray(maybeEstimatesOrderData)) return false
    if (maybeEstimatesOrderData.length < 1) return false

    const validEstimateOrderValues = Object.values(EstimateType)
    return maybeEstimatesOrderData
        .every((estimateType: unknown) => {
            if (!estimateType || typeof estimateType !== 'object') return false
            if (!('type' in estimateType)) return false
            if (!validEstimateOrderValues.includes(estimateType.type as EstimateType)) return false
            if ('disabled' in estimateType && typeof estimateType.disabled !== 'boolean') return false
            return true
        })
}

export function setEstimatesOrderDataToStorage(estimatesOrderData: EstimatesOrderData) {
    const storeValue = JSON.stringify(estimatesOrderData)
    localStorage.setItem(estimatesOrderStorageKey, storeValue)
}

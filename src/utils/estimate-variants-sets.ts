import { NonValueUnitEstimate } from '@/definitions/estimates'
import { truthy } from '@/utils/utils'
import type { EstimateVariantsSet, EstimateVariantsSetId } from '@/definitions/estimate-variants-sets'

const estimatesOrderStoragePrefix = 'PERT-estimating_custom-estimate-variants-set'

export function getStoredCustomEstimateVariantsSetsIfValid() {
    return Object.keys(localStorage)
        .filter((storageKey) => storageKey.startsWith(estimatesOrderStoragePrefix))
        .map((storageKey) => {
            try {
                const set = JSON.parse(localStorage.getItem(storageKey)!)
                if (!isValidEstimateVariantsSet(set)) return null

                return set
            } catch {
                return null
            }
        })
        .filter(truthy)
}

function isValidEstimateVariantsSet(maybeEstimateVariantsSet: unknown): maybeEstimateVariantsSet is EstimateVariantsSet {
    if (typeof maybeEstimateVariantsSet !== 'object' || maybeEstimateVariantsSet === null) return false
    if (!('id' in maybeEstimateVariantsSet) || typeof maybeEstimateVariantsSet.id !== 'string') return false
    if (!('name' in maybeEstimateVariantsSet) || typeof maybeEstimateVariantsSet.name !== 'string') return false
    if (!('variants' in maybeEstimateVariantsSet) || !Array.isArray(maybeEstimateVariantsSet.variants)) return false

    return maybeEstimateVariantsSet.variants.every((variant) => {
        const isNonValueUnitEstimate = Object.values(NonValueUnitEstimate).includes(variant)
        const isNumber = typeof variant === 'number'

        return isNonValueUnitEstimate || isNumber
    })
}

export function setEstimateVariantsSetToStorage(estimateVariantsSet: EstimateVariantsSet) {
    const storeValue = JSON.stringify(estimateVariantsSet)
    localStorage.setItem(getStorageKeyByEstimateVariantsSetId(estimateVariantsSet.id), storeValue)
}

export function removeEstimateVariantsSetFromStorage(estimateVariantsSetId: EstimateVariantsSetId) {
    localStorage.removeItem(getStorageKeyByEstimateVariantsSetId(estimateVariantsSetId))
}

function getStorageKeyByEstimateVariantsSetId(estimateVariantsSetId: EstimateVariantsSetId) {
    return `${estimatesOrderStoragePrefix}_${estimateVariantsSetId}`
}

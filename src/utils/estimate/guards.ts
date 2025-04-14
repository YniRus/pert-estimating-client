import type { Estimates, ValueUnitEstimate } from '@/definitions/estimates'
import { NonValueUnitEstimate, HIDDEN_ESTIMATE } from '@/definitions/estimates'
import { truthy } from '@/utils/utils'

export function isValueUnitEstimate(estimate?: unknown): estimate is ValueUnitEstimate {
    if (!estimate || typeof estimate !== 'object') return false

    return 'value' in estimate && 'unit' in estimate
}

export function isNonValueUnitEstimate(estimate?: unknown): estimate is NonValueUnitEstimate {
    if (!estimate || typeof estimate !== 'string') return false

    return Object.values(NonValueUnitEstimate).includes(estimate as NonValueUnitEstimate)
}

export function isHiddenEstimate(estimate?: unknown) {
    return estimate === HIDDEN_ESTIMATE
}

export function isEmptyLikeEstimates(estimates?: Estimates) {
    return Object.values(estimates || {}).every(isEmptyLikeEstimate)
}

export function isEmptyLikeEstimate(estimate?: unknown) {
    return !estimate || isNonValueUnitEstimate(estimate)
}

export function isEmptyEstimates(estimates?: Estimates) {
    return !Object.values(estimates || {}).some(truthy)
}

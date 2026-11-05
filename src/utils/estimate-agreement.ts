import { type Estimates, EstimateType } from '@/definitions/estimates'
import { getBestValueUnitEstimateOfType, getEstimateValueInMinimalUnit, minimalEstimateUnit } from '@/utils/estimate/estimate'
import { isValueUnitEstimate } from '@/utils/estimate/guards'
import { calculatePERT } from '@/utils/pert'

export function calculateAgreement(values: number[]): number | null {
    if (values.length < 2) return null

    const mean = values.reduce((sum, value) => sum + value, 0) / values.length
    const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
    const percentage = mean === 0 ? 100 : Math.max(0, 100 - Math.sqrt(variance) / mean * 100)
    return Math.round(percentage * 10) / 10
}

export function calculateEstimatesAgreement(estimates: Estimates[], type?: EstimateType): number | null {
    const numericEstimates = estimates.filter((estimate) => Object.values(estimate).some(isValueUnitEstimate))
    const values = numericEstimates.map((estimate) => type
        ? getEstimateValueInMinimalUnit(getBestValueUnitEstimateOfType(type, estimate))
        : calculatePERT(estimate, minimalEstimateUnit).value)

    return calculateAgreement(values)
}

import {
    type Estimate,
    type Estimates,
    EstimateType,
    EstimateUnit,
    type ValueUnitEstimate,
} from '@/definitions/estimates'
import { isValueUnitEstimate } from '@/utils/estimate/guards'

const estimateTypesWeightsOrder = [EstimateType.Probable, EstimateType.Min, EstimateType.Max]

export function getBestValueUnitEstimateOfType(type: EstimateType, estimates?: Estimates) {
    if (!estimates) return

    const estimateTypesOrder = Array.from(new Set([type, ...estimateTypesWeightsOrder]))

    for (const estimateType of estimateTypesOrder) {
        const estimate = estimates[estimateType as EstimateType]
        if (isValueUnitEstimate(estimate)) return estimate
    }
}

export const minimalEstimateUnit = EstimateUnit.Hours

const hoursInDay = 8
const daysInWeek = 5
const weeksInMonth = 4

const ratioToMinimalUnit: Record<EstimateUnit, number> = {
    [EstimateUnit.Hours]: 1,
    [EstimateUnit.Days]: hoursInDay,
    [EstimateUnit.Weeks]: hoursInDay * daysInWeek,
    [EstimateUnit.Months]: hoursInDay * daysInWeek * weeksInMonth,
}

export function getRatio(unit: EstimateUnit, targetUnit: EstimateUnit) {
    return ratioToMinimalUnit[unit] / ratioToMinimalUnit[targetUnit]
}

export function getEstimateValueInMinimalUnit(estimate?: Estimate): number {
    if (!isValueUnitEstimate(estimate)) return 0
    return estimate.value * ratioToMinimalUnit[estimate.unit]
}

export function convertEstimateToUnit(estimate: ValueUnitEstimate, targetUnit: EstimateUnit): ValueUnitEstimate {
    if (estimate.unit === targetUnit) return estimate

    return {
        value: estimate.value * getRatio(estimate.unit, targetUnit),
        unit: targetUnit,
    }
}

export function convertEstimateToBestUnit(estimate: ValueUnitEstimate, minimalValue = 1): ValueUnitEstimate {
    const estimateValueInMinimalUnit = getEstimateValueInMinimalUnit(estimate)

    for (const [unit, ratio] of Object.entries(ratioToMinimalUnit).reverse()) {
        const value = estimateValueInMinimalUnit / ratio
        if (value >= minimalValue) return { unit: unit as EstimateUnit, value }
    }

    return estimate
}

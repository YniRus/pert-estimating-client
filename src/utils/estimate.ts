import {
    type Estimate,
    type Estimates,
    EstimateType,
    EstimateUnit,
    HIDDEN_ESTIMATE,
    type ValueUnitEstimate,
} from '@/definitions/estimates'

export function getEstimateUnitColor(unit: EstimateUnit) {
    switch (unit) {
        case EstimateUnit.Hours: return 'primary'
        case EstimateUnit.Days: return 'success'
        case EstimateUnit.Weeks: return 'purple'
        case EstimateUnit.Months: return 'red'
    }
}

export function isValueUnitEstimate(estimate?: Estimate): estimate is ValueUnitEstimate {
    if (typeof estimate !== 'object') return false

    return 'value' in estimate && 'unit' in estimate
}

export function isHiddenEstimate(estimate?: Estimate) {
    return estimate === HIDDEN_ESTIMATE
}

const estimateTypesBaseOrder = [EstimateType.Probable, EstimateType.Min, EstimateType.Max]

export function getBestValueUnitEstimateOfType(type: EstimateType, estimates?: Estimates) {
    if (!estimates) return

    const estimateTypesOrder = Array.from(new Set([type, ...estimateTypesBaseOrder]))

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
    return isValueUnitEstimate(estimate)
        ? estimate.value * ratioToMinimalUnit[estimate.unit]
        : 0
}

export function convertEstimateToUnit(estimate: ValueUnitEstimate, targetUnit: EstimateUnit): ValueUnitEstimate {
    if (estimate.unit === targetUnit) return estimate

    return {
        value: estimate.value * getRatio(estimate.unit, targetUnit),
        unit: targetUnit,
    }
}

export function convertEstimateToBestUnit(estimate: ValueUnitEstimate, minimalValue = 1): ValueUnitEstimate {
    for (const [unit, ratio] of Object.entries(ratioToMinimalUnit).reverse()) {
        const value = estimate.value / ratio
        if (value >= minimalValue) return { unit: unit as EstimateUnit, value }
    }

    return estimate
}

export const baseEstimateValues = [0, 1, 2, 3, 5, 8, 13, 20]

interface BaseEstimateWithDiff {
    estimate: ValueUnitEstimate
    diff: number
}

export function getNearestBaseEstimate(estimate: ValueUnitEstimate) {
    const nearestBaseEstimateByUnit: BaseEstimateWithDiff[] = []

    for (const unit of Object.values(EstimateUnit)) {
        const { value } = convertEstimateToUnit(estimate, unit)

        const valuesInOrder = [value, ...baseEstimateValues].sort((a, b) => a - b)
        const valueIndex = valuesInOrder.indexOf(value)
        const [estimateValue, nearestValue] = [valuesInOrder[valueIndex], valuesInOrder[valueIndex + 1]]

        if (estimateValue != null && nearestValue != null) {
            nearestBaseEstimateByUnit.push({
                diff: getDiff(nearestValue, estimateValue, getRatio(estimate.unit, unit)),
                estimate: {
                    value: nearestValue,
                    unit,
                },
            })
        }
    }

    const [nearestBaseEstimate] = nearestBaseEstimateByUnit.sort((a, b) => a.diff - b.diff)

    return nearestBaseEstimate?.estimate || estimate
}

function getDiff(value1: number, value2: number, ratio = 1, digits = 6) {
    const diff = (value1 - value2) / ratio
    return Number(diff.toFixed(digits))
}

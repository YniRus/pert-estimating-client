import type { ValueUnitEstimate } from '@/definitions/estimates'
import { EstimateUnit } from '@/definitions/estimates'
import { baseEstimateValues, convertEstimateToUnit, getRatio } from '@/utils/estimate/estimate'

interface BaseEstimateWithDiff {
    estimate: ValueUnitEstimate
    diff: number
}

export function getNearestBaseValueEstimate(estimate: ValueUnitEstimate) {
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

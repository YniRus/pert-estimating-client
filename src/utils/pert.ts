import {
    type Estimates,
    EstimateType,
    EstimateUnit,
    type ValueUnitEstimate,
} from '@/definitions/estimates'
import {
    convertEstimateToBestUnit,
    convertEstimateToUnit,
    getBestValueUnitEstimateOfType,
    getEstimateValueInMinimalUnit,
    minimalEstimateUnit,
} from '@/utils/estimate'
import { truthy } from '@/utils/utils'

export function calculatePERT(estimates?: Estimates, targetUnit?: EstimateUnit): ValueUnitEstimate {
    const min = getBestValueUnitEstimateOfType(EstimateType.Min, estimates)
    const probable = getBestValueUnitEstimateOfType(EstimateType.Probable, estimates)
    const max = getBestValueUnitEstimateOfType(EstimateType.Max, estimates)

    const estimateInMinimalUnit = {
        value: getPertValue(
            getEstimateValueInMinimalUnit(min),
            getEstimateValueInMinimalUnit(probable),
            getEstimateValueInMinimalUnit(max),
        ),
        unit: minimalEstimateUnit,
    }

    targetUnit = targetUnit || getEstimateUnitIfSame(min, probable, max)

    return targetUnit
        ? convertEstimateToUnit(estimateInMinimalUnit, targetUnit)
        : convertEstimateToBestUnit(estimateInMinimalUnit)
}

function getPertValue(min: number, probable: number, max: number) {
    return (min + probable * 4 + max) / 6
}

function getEstimateUnitIfSame(...args: (ValueUnitEstimate | undefined)[]) {
    const estimateUnits = args.map((estimate) => estimate?.unit).filter(truthy)
    const uniqueEstimateUnits = Array.from(new Set(estimateUnits))

    if (uniqueEstimateUnits.length !== 1) return
    return uniqueEstimateUnits[0]
}

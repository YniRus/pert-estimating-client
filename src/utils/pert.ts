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
    isValueUnitEstimate,
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

export function calculateAvgPERT<T extends { estimates?: Estimates }>(data: T[], targetUnit: EstimateUnit): ValueUnitEstimate {
    const valueUnitEstimates = data
        .filter((user) => Object.values(user.estimates || {}).some(isValueUnitEstimate))

    const sumEstimateValue = valueUnitEstimates.reduce((sumEstimateValue, user) => {
        const value = calculatePERT(user.estimates, targetUnit).value
        return sumEstimateValue + value
    }, 0)

    return {
        value: (sumEstimateValue / valueUnitEstimates.length) || 0,
        unit: targetUnit,
    }
}

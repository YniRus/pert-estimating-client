import { describe, it, expect } from 'vitest'
import {
    convertEstimateToUnit,
    convertEstimateToBestUnit,
    getEstimateValueInMinimalUnit,
    getBestValueUnitEstimateOfType,
} from '@/utils/estimate/estimate'
import { type Estimate, EstimateType, EstimateUnit, NonValueUnitEstimate } from '@/definitions/estimates'

describe('convertEstimateToUnit', () => {
    it('should return the original estimate when the target unit is the same as the estimate unit', () => {
        const estimate = { value: 5, unit: EstimateUnit.Days }
        const targetUnit = EstimateUnit.Days

        const result = convertEstimateToUnit(estimate, targetUnit)

        expect(result).toEqual(estimate)
    })

    it('should correctly convert from a smaller unit to a larger unit', () => {
        const estimate = { value: 20, unit: EstimateUnit.Hours }
        const targetUnit = EstimateUnit.Days

        const result = convertEstimateToUnit(estimate, targetUnit)

        expect(result).toEqual({ value: 2.5, unit: EstimateUnit.Days })
    })

    it('should correctly convert from a larger unit to a smaller unit', () => {
        const estimate = { value: 2.5, unit: EstimateUnit.Days }
        const targetUnit = EstimateUnit.Hours

        const result = convertEstimateToUnit(estimate, targetUnit)

        expect(result).toEqual({ value: 20, unit: EstimateUnit.Hours })
    })

    it('should correctly convert zero value for any unit', () => {
        const estimate = { value: 0, unit: EstimateUnit.Days }
        const targetUnits = Object.values(EstimateUnit)

        targetUnits.forEach((targetUnit) => {
            const result = convertEstimateToUnit(estimate, targetUnit)
            expect(result).toEqual({ value: 0, unit: targetUnit })
        })
    })
})

describe('convertEstimateToBestUnit', () => {
    it('should return the original estimate when no unit conversion results in a value greater than or equal to minimalValue', () => {
        const estimate = { value: 0.5, unit: EstimateUnit.Hours }

        const result = convertEstimateToBestUnit(estimate)

        expect(result).toEqual(estimate)
    })

    it('should handle the case where the estimate value is exactly equal to the minimalValue after conversion', () => {
        const estimate = { value: 40, unit: EstimateUnit.Hours }

        const result = convertEstimateToBestUnit(estimate)

        expect(result).toEqual({ value: 1, unit: EstimateUnit.Weeks })
    })

    it('should correctly convert when the estimate value is exactly one unit higher than minimalValue', () => {
        const estimate = { value: 9, unit: EstimateUnit.Hours } // 9 hours is 1.125 days
        const minimalValue = 1

        const result = convertEstimateToBestUnit(estimate, minimalValue)

        expect(result).toEqual({ value: 1.125, unit: EstimateUnit.Days })
    })

    it('should handle the case where the estimate value is a very large number', () => {
        const estimate = { value: 100000, unit: EstimateUnit.Hours }

        const result = convertEstimateToBestUnit(estimate)

        expect(result).toEqual({ value: 625, unit: EstimateUnit.Months })
    })

    it('should correctly convert zero value for any unit', () => {
        const estimate = { value: 0, unit: EstimateUnit.Days }
        const targetUnits = Object.values(EstimateUnit)

        targetUnits.forEach(() => {
            const result = convertEstimateToBestUnit(estimate)
            expect(result).toEqual({ value: 0, unit: EstimateUnit.Days })
        })
    })

    it('should correctly convert the same estimate with different minimalValues', () => {
        const estimate = { value: 40, unit: EstimateUnit.Hours }

        const result1 = convertEstimateToBestUnit(estimate, 1)
        expect(result1).toEqual({ value: 1, unit: EstimateUnit.Weeks })

        const result2 = convertEstimateToBestUnit(estimate, 2)
        expect(result2).toEqual({ value: 5, unit: EstimateUnit.Days })

        const result3 = convertEstimateToBestUnit(estimate, 10)
        expect(result3).toEqual({ value: 40, unit: EstimateUnit.Hours })

        const result4 = convertEstimateToBestUnit(estimate, 125)
        expect(result4).toEqual({ value: 40, unit: EstimateUnit.Hours })
    })

    it('should correctly convert the same estimate in non minimalUnit with different minimalValues', () => {
        const estimate = { value: 20, unit: EstimateUnit.Days }

        const result1 = convertEstimateToBestUnit(estimate, 1)
        expect(result1).toEqual({ value: 1, unit: EstimateUnit.Months })

        const result2 = convertEstimateToBestUnit(estimate, 2)
        expect(result2).toEqual({ value: 4, unit: EstimateUnit.Weeks })

        const result3 = convertEstimateToBestUnit(estimate, 10)
        expect(result3).toEqual({ value: 20, unit: EstimateUnit.Days })

        const result4 = convertEstimateToBestUnit(estimate, 100)
        expect(result4).toEqual({ value: 160, unit: EstimateUnit.Hours })
    })
})

describe('getEstimateValueInMinimalUnit', () => {
    it('should return 0 when the estimate is undefined', () => {
        const result = getEstimateValueInMinimalUnit(undefined)
        expect(result).toBe(0)
    })

    it('should return 0 when estimate is non ValueUnitEstimate', () => {
        const missingValueEstimate = { unit: EstimateUnit.Days } as Estimate
        const missingUnitEstimate = { value: 10 } as Estimate

        expect(getEstimateValueInMinimalUnit(missingValueEstimate)).toBe(0)
        expect(getEstimateValueInMinimalUnit(missingUnitEstimate)).toBe(0)
    })

    it('should handle the case where the estimate value is zero with a valid unit', () => {
        const estimate = { value: 0, unit: EstimateUnit.Days }
        const result = getEstimateValueInMinimalUnit(estimate)
        expect(result).toBe(0)
    })

    it('should correctly calculate the minimal unit value for a valid estimate from all known units', () => {
        const estimates = [
            { value: 3, unit: EstimateUnit.Hours, expected: 3 },
            { value: 3, unit: EstimateUnit.Days, expected: 3 * 8 }, // 3 days * 8 hours per day
            { value: 3, unit: EstimateUnit.Weeks, expected: 3 * 8 * 5 }, // 3 weeks * 5 days per week * 8 hours per day
            { value: 3, unit: EstimateUnit.Months, expected: 3 * 8 * 5 * 4 }, // 3 months * 4 weeks per month * 5 days per week * 8 hours per day
        ]

        estimates.forEach(({ value, unit, expected }) => {
            const result = getEstimateValueInMinimalUnit({ value, unit })
            expect(result).toBe(expected)
        })
    })
})

describe('getBestValueUnitEstimateOfType', () => {
    it('should return "undefined" when estimates is empty', () => {
        const undefinedResult = getBestValueUnitEstimateOfType(EstimateType.Min, undefined)
        expect(undefinedResult).toBeUndefined()

        const emptyObjectResult = getBestValueUnitEstimateOfType(EstimateType.Min, {})
        expect(emptyObjectResult).toBeUndefined()
    })

    it('should return "undefined" when all estimates is NonValueUnitEstimate', () => {
        const estimates = {
            [EstimateType.Min]: NonValueUnitEstimate.Chill,
            [EstimateType.Probable]: NonValueUnitEstimate.IDontKnow,
            [EstimateType.Max]: undefined,
        }

        const result = getBestValueUnitEstimateOfType(EstimateType.Min, estimates)

        expect(result).toBeUndefined()
    })

    it('should return self if it correct ValueUnitEstimate', () => {
        const estimates = {
            [EstimateType.Min]: { value: 3, unit: EstimateUnit.Hours },
            [EstimateType.Probable]: { value: 5, unit: EstimateUnit.Hours },
            [EstimateType.Max]: { value: 8, unit: EstimateUnit.Hours },
        }

        const result = getBestValueUnitEstimateOfType(EstimateType.Min, estimates)

        expect(result).toEqual({ value: 3, unit: EstimateUnit.Hours })
    })

    it('should return the first valid ValueUnitEstimate for Probable type', () => {
        const estimates = {
            [EstimateType.Min]: { value: 5, unit: EstimateUnit.Hours },
            [EstimateType.Probable]: undefined,
            [EstimateType.Max]: { value: 2, unit: EstimateUnit.Days },
        }

        const result = getBestValueUnitEstimateOfType(EstimateType.Probable, estimates)

        expect(result).toEqual({ value: 5, unit: EstimateUnit.Hours })
    })

    it('should return the first valid ValueUnitEstimate for Max type', () => {
        const estimates = {
            [EstimateType.Min]: { value: 5, unit: EstimateUnit.Hours },
            [EstimateType.Probable]: { value: 8, unit: EstimateUnit.Hours },
            [EstimateType.Max]: undefined,
        }

        const result = getBestValueUnitEstimateOfType(EstimateType.Probable, estimates)

        expect(result).toEqual({ value: 8, unit: EstimateUnit.Hours })
    })

    it('should return the first valid ValueUnitEstimate for Min type with NonValueUnitEstimate', () => {
        const estimates = {
            [EstimateType.Min]: undefined,
            [EstimateType.Probable]: NonValueUnitEstimate.IDontKnow,
            [EstimateType.Max]: { value: 10, unit: EstimateUnit.Days },
        }

        const result = getBestValueUnitEstimateOfType(EstimateType.Min, estimates)

        expect(result).toEqual({ value: 10, unit: EstimateUnit.Days })
    })
})

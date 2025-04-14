import { describe, it, expect } from 'vitest'
import { type ValueUnitEstimate, EstimateUnit, EstimateType, NonValueUnitEstimate } from '@/definitions/estimates'
import { __forTestsOnly__, calculatePERT, calculateAvgPERT } from '@/utils/pert'
import { minimalEstimateUnit } from '@/utils/estimate/estimate'

describe('getEstimateUnitIfSame', () => {
    const { getEstimateUnitIfSame } = __forTestsOnly__

    it('should return undefined when no estimates are provided', () => {
        const result = getEstimateUnitIfSame()

        expect(result).toBeUndefined()
    })

    it('should return unit when some provided estimates are undefined but other have the same unit', () => {
        const min: ValueUnitEstimate = { value: 1, unit: EstimateUnit.Days }
        const probable: ValueUnitEstimate = { value: 2, unit: EstimateUnit.Days }
        const max = undefined

        const result = getEstimateUnitIfSame(min, probable, max)

        expect(result).toBe(EstimateUnit.Days)
    })

    it('should return undefined when estimates have different units', () => {
        const min: ValueUnitEstimate = { value: 1, unit: EstimateUnit.Days }
        const probable: ValueUnitEstimate = { value: 2, unit: EstimateUnit.Hours }
        const max: ValueUnitEstimate = { value: 3, unit: EstimateUnit.Days }

        const result = getEstimateUnitIfSame(min, probable, max)

        expect(result).toBeUndefined()
    })

    it('should return the unit when all provided estimates have the same unit', () => {
        const min: ValueUnitEstimate = { value: 1, unit: EstimateUnit.Days }
        const probable: ValueUnitEstimate = { value: 2, unit: EstimateUnit.Days }
        const max: ValueUnitEstimate = { value: 3, unit: EstimateUnit.Days }

        const result = getEstimateUnitIfSame(min, probable, max)

        expect(result).toBe(EstimateUnit.Days)
    })

    it('should return the unit when a single estimate is provided', () => {
        const estimate: ValueUnitEstimate = { value: 5, unit: EstimateUnit.Hours }

        const result = getEstimateUnitIfSame(estimate)

        expect(result).toBe(EstimateUnit.Hours)
    })
})

describe('calculatePERT', () => {
    it('should calculate PERT value correctly with all three estimates provided with same unit', () => {
        const estimates = {
            [EstimateType.Min]: { value: 2, unit: EstimateUnit.Hours },
            [EstimateType.Probable]: { value: 8, unit: EstimateUnit.Hours },
            [EstimateType.Max]: { value: 20, unit: EstimateUnit.Hours },
        }

        const result = calculatePERT(estimates)

        expect(result).toEqual({ value: 9, unit: EstimateUnit.Hours })
    })

    it('should calculate PERT value correctly with all three estimates provided with not same unit (and convert to best unit)', () => {
        const estimates = {
            [EstimateType.Min]: { value: 2, unit: EstimateUnit.Hours },
            [EstimateType.Probable]: { value: 1, unit: EstimateUnit.Days }, // 1d = 8h
            [EstimateType.Max]: { value: 20, unit: EstimateUnit.Hours },
        }

        const result = calculatePERT(estimates)

        // PERT: 1.125d (no Fixed)
        expect(result).toEqual({ value: 1.1, unit: EstimateUnit.Days })
    })

    it('should calculate PERT value correctly with all three estimates provided with not same unit and targetUnit', () => {
        const estimates = {
            [EstimateType.Min]: { value: 2, unit: EstimateUnit.Hours },
            [EstimateType.Probable]: { value: 1, unit: EstimateUnit.Days }, // 1d = 8h
            [EstimateType.Max]: { value: 20, unit: EstimateUnit.Hours },
        }

        const result = calculatePERT(estimates, EstimateUnit.Hours)

        expect(result).toEqual({ value: 9, unit: EstimateUnit.Hours })
    })

    it('should calculate PERT value correctly when some types is missing', () => {
        const estimates = {
            [EstimateType.Min]: { value: 3, unit: EstimateUnit.Hours },
            [EstimateType.Probable]: { value: 5, unit: EstimateUnit.Hours },
        }

        // Expected PERT calculation with missing Max:
        // Max will be undefined, so getBestValueUnitEstimateOfType(max) will provide probable
        // (3 + 5*4 + 5) / 6 = 4.66(6)7 hours
        const result = calculatePERT(estimates)

        expect(result).toEqual({ value: 4.7, unit: EstimateUnit.Hours })
    })

    it('should calculate PERT value correctly when some types is NonValueUnitEstimate', () => {
        const estimates = {
            [EstimateType.Min]: { value: 3, unit: EstimateUnit.Hours },
            [EstimateType.Probable]: NonValueUnitEstimate.IDontKnow,
            [EstimateType.Max]: { value: 2, unit: EstimateUnit.Days },
        }

        // Expected PERT calculation with missing Probable:
        // Probable will be NonValueUnitEstimate, so getBestValueUnitEstimateOfType(probable) will provide next best estimate (min)
        // (3 + 3*4 + 2*8) / 6 = 5.166(6)7
        const result = calculatePERT(estimates)

        expect(result).toEqual({ value: 5.2, unit: EstimateUnit.Hours })
    })

    it('should calculate PERT value correctly when only one type of estimate is provided', () => {
        const estimates = {
            [EstimateType.Max]: { value: 3, unit: EstimateUnit.Days },
        }

        const result = calculatePERT(estimates)

        // Expected PERT calculation with only Max provided:
        // Min and Probable will be undefined, so getBestValueUnitEstimateOfType will provide max for both
        // (3 + 3*4 + 3) / 6 = 3 days
        expect(result).toEqual({ value: 3, unit: EstimateUnit.Days })
    })

    it('should calculate PERT value correctly when estimates are undefined', () => {
        const undefinedResult = calculatePERT(undefined)
        const partialUndefinedResult = calculatePERT({
            [EstimateType.Min]: undefined,
        })
        const fullUndefinedResult = calculatePERT({
            [EstimateType.Min]: undefined,
            [EstimateType.Probable]: undefined,
            [EstimateType.Max]: undefined,
        })

        // Since all estimates are undefined, the PERT calculation should default to zero value in the minimal unit
        expect(undefinedResult).toEqual({ value: 0, unit: EstimateUnit.Hours })
        expect(partialUndefinedResult).toEqual({ value: 0, unit: EstimateUnit.Hours })
        expect(fullUndefinedResult).toEqual({ value: 0, unit: EstimateUnit.Hours })
    })

    it('should calculate PERT value correctly when targetUnit is the same as the unit of all estimates', () => {
        const estimates = {
            [EstimateType.Min]: { value: 2, unit: EstimateUnit.Days },
            [EstimateType.Probable]: { value: 3, unit: EstimateUnit.Days },
            [EstimateType.Max]: { value: 5, unit: EstimateUnit.Days },
        }

        const result = calculatePERT(estimates, EstimateUnit.Days)

        // Expected PERT calculation:
        // (2 + 3*4 + 5) / 6 = 3.166(6)7 days
        expect(result).toEqual({ value: 3.2, unit: EstimateUnit.Days })

        const resultWithoutTarget = calculatePERT(estimates)

        expect(result).toEqual(resultWithoutTarget)
    })
})

describe('calculateAvgPERT', () => {
    it('should return 0 when the input data array is empty', () => {
        const result = calculateAvgPERT([], minimalEstimateUnit)

        expect(result).toEqual({ value: 0, unit: minimalEstimateUnit })
    })

    it('should return 0 when none of the estimates in the data array are ValueUnitEstimates', () => {
        const data = [
            {
                estimates: {
                    [EstimateType.Min]: NonValueUnitEstimate.Chill,
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: NonValueUnitEstimate.Chill,
                    [EstimateType.Probable]: NonValueUnitEstimate.IDontKnow,
                    [EstimateType.Max]: NonValueUnitEstimate.Chill,
                },
            },
            {
                estimates: {
                    [EstimateType.Probable]: NonValueUnitEstimate.Chill,
                    [EstimateType.Max]: NonValueUnitEstimate.IDontKnow,
                },
            },
        ]

        const result = calculateAvgPERT(data, minimalEstimateUnit)

        expect(result).toEqual({ value: 0, unit: minimalEstimateUnit })
    })

    it('should correctly calculate the average PERT value when all estimates have the same unit (with and not same targetUnit)', () => {
        const data = [
            {
                estimates: {
                    [EstimateType.Min]: { value: 2, unit: EstimateUnit.Days },
                    [EstimateType.Probable]: { value: 3, unit: EstimateUnit.Days },
                    [EstimateType.Max]: { value: 5, unit: EstimateUnit.Days },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 1, unit: EstimateUnit.Days },
                    [EstimateType.Probable]: { value: 4, unit: EstimateUnit.Days },
                    [EstimateType.Max]: { value: 6, unit: EstimateUnit.Days },
                },
            },
        ]

        const result = calculateAvgPERT(data, EstimateUnit.Days)

        // Expected average PERT calculation:
        // First estimate: (2 + 3*4 + 5) / 6 = 3.166(6)7 days
        // Second estimate: (1 + 4*4 + 6) / 6 = 3.833(3)3 days
        // Average: (3.166667 + 3.833333) / 2 = 3.5 days
        expect(result).toEqual({ value: 3.5, unit: EstimateUnit.Days })

        const resultInHours = calculateAvgPERT(data, EstimateUnit.Hours)

        // Expected average PERT calculation:
        // First estimate: (2*8 + 3*8*4 + 5*8) / 6 = 25.333(3) hours
        // Second estimate: (1*8 + 4*8*4 + 6*8) / 6 = 30.666(6)7 hours
        // Average: (25.333333 + 30.66667) / 2 = 28 hours
        expect(resultInHours).toEqual({ value: 28, unit: EstimateUnit.Hours })
    })

    it('should correctly calculate the average PERT value when estimates have different units and need conversion', () => {
        const data = [
            {
                estimates: {
                    [EstimateType.Min]: { value: 2, unit: EstimateUnit.Hours },
                    [EstimateType.Probable]: { value: 1, unit: EstimateUnit.Days }, // 1d = 8h
                    [EstimateType.Max]: { value: 5, unit: EstimateUnit.Hours },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 3, unit: EstimateUnit.Days }, // 3d = 24h
                    [EstimateType.Probable]: { value: 4, unit: EstimateUnit.Hours },
                    [EstimateType.Max]: { value: 6, unit: EstimateUnit.Hours },
                },
            },
        ]

        const result = calculateAvgPERT(data, EstimateUnit.Hours)

        // Expected average PERT calculation:
        // First estimate: (2 + 8*4 + 5) / 6 = 6.5 hours
        // Second estimate: (24 + 4*4 + 6) / 6 = 7.666(6)7 hours
        // Average: (6.5 + 7.666667) / 2 = 7.0833(3)4
        expect(result).toEqual({ value: 7.1, unit: EstimateUnit.Hours })
    })

    it('should handle cases where some estimates are missing from the data array', () => {
        const data = [
            {
                estimates: {
                    [EstimateType.Min]: { value: 2, unit: EstimateUnit.Days },
                    [EstimateType.Probable]: { value: 3, unit: EstimateUnit.Days },
                },
            },
            {
                estimates: {
                    [EstimateType.Max]: { value: 1, unit: EstimateUnit.Weeks },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 8, unit: EstimateUnit.Hours },
                    [EstimateType.Max]: { value: 4, unit: EstimateUnit.Days },
                },
            },
        ]

        const result = calculateAvgPERT(data, EstimateUnit.Days)

        // Expected average PERT calculation:
        // First estimate: (2 + 3*4 + 3) / 6 = 2.833(3)4 days (Max is missing, so Probable is used)
        // Second estimate: (5 + 5*4 + 5) / 6 = 5 days (Min and Probable are missing, so Max is used)
        // Third estimate: (1 + 1*4 + 4) / 6 = 1.5 days (Probable is missing, so Min is used)
        // Average: (2.833334 + 5 + 1.5) / 3 = 3.111(1) days
        expect(result).toEqual({ value: 3.1, unit: EstimateUnit.Days })
    })

    it('should handle cases where some estimates are NonValueUnitEstimates in the data array', () => {
        const data = [
            {
                estimates: {
                    [EstimateType.Min]: { value: 2, unit: EstimateUnit.Days },
                    [EstimateType.Probable]: NonValueUnitEstimate.IDontKnow,
                    [EstimateType.Max]: { value: 5, unit: EstimateUnit.Days },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: NonValueUnitEstimate.IDontKnow,
                    [EstimateType.Probable]: { value: 4, unit: EstimateUnit.Days },
                    [EstimateType.Max]: { value: 6, unit: EstimateUnit.Days },
                },
            },
        ]

        const result = calculateAvgPERT(data, EstimateUnit.Days)

        // Expected average PERT calculation:
        // First estimate: (2 + 2*4 + 5) / 6 = 2.5 days (Probable is NonValueUnitEstimate, so Min is used)
        // Second estimate: (4 + 4*4 + 6) / 6 = 4.333(3)3 days (Min is NonValueUnitEstimate, so Probable is used)
        // Average: (2.5 + 4.333333) / 2 = 3.416(6)7 days
        expect(result).toEqual({ value: 3.4, unit: EstimateUnit.Days })
    })

    it('should correct result for floating partial result and integer final result', () => {
        const data = [
            {
                estimates: {
                    [EstimateType.Min]: { value: 1, unit: EstimateUnit.Hours },
                    [EstimateType.Probable]: { value: 2, unit: EstimateUnit.Hours },
                    [EstimateType.Max]: { value: 2, unit: EstimateUnit.Hours },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 2, unit: EstimateUnit.Hours },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 2, unit: EstimateUnit.Hours },
                    [EstimateType.Probable]: { value: 3, unit: EstimateUnit.Hours },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 2, unit: EstimateUnit.Hours },
                    [EstimateType.Probable]: { value: 3, unit: EstimateUnit.Hours },
                    [EstimateType.Max]: { value: 3, unit: EstimateUnit.Hours },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 5, unit: EstimateUnit.Hours },
                    [EstimateType.Probable]: { value: 5, unit: EstimateUnit.Hours },
                    [EstimateType.Max]: { value: 8, unit: EstimateUnit.Hours },
                },
            },
        ]

        const result = calculateAvgPERT(data, EstimateUnit.Hours)

        expect(result).toEqual({ value: 3, unit: EstimateUnit.Hours })
    })

    it('should correct result for floating partial result and integer final result (another case)', () => {
        const data = [
            {
                estimates: {
                    [EstimateType.Min]: { value: 1, unit: EstimateUnit.Days },
                    [EstimateType.Probable]: { value: 2, unit: EstimateUnit.Days },
                    [EstimateType.Max]: { value: 2, unit: EstimateUnit.Days },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 2, unit: EstimateUnit.Days },
                    [EstimateType.Probable]: { value: 2, unit: EstimateUnit.Days },
                    [EstimateType.Max]: { value: 3, unit: EstimateUnit.Days },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 13, unit: EstimateUnit.Hours },
                    [EstimateType.Probable]: { value: 2, unit: EstimateUnit.Days },
                    [EstimateType.Max]: { value: 5, unit: EstimateUnit.Days },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 2, unit: EstimateUnit.Days },
                    [EstimateType.Probable]: { value: 3, unit: EstimateUnit.Days },
                },
            },
            {
                estimates: {
                    [EstimateType.Min]: { value: 3, unit: EstimateUnit.Days },
                    [EstimateType.Max]: { value: 5, unit: EstimateUnit.Days },
                },
            },
            {
                estimates: {
                    [EstimateType.Probable]: { value: 5, unit: EstimateUnit.Days },
                    [EstimateType.Max]: { value: 8, unit: EstimateUnit.Days },
                },
            },
        ]

        const result = calculateAvgPERT(data, EstimateUnit.Days)

        expect(result).toEqual({ value: 3, unit: EstimateUnit.Days })
    })
})

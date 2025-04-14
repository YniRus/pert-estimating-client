import { describe, it, expect } from 'vitest'
import { getNearestBaseValueEstimate } from '@/utils/estimate/nearest'
import { EstimateUnit, type ValueUnitEstimate } from '@/definitions/estimates'

describe('getNearestBaseValueEstimate', () => {
    it('should return input estimate if no nearest base value estimate', () => {
        const estimate: ValueUnitEstimate = { value: 30, unit: EstimateUnit.Months }
        const result = getNearestBaseValueEstimate(estimate)

        expect(result).toEqual(estimate)
    })

    it('should return nearest estimate in same unit', () => {
        const estimate: ValueUnitEstimate = { value: 10, unit: EstimateUnit.Hours }
        const result = getNearestBaseValueEstimate(estimate)

        expect(result).toEqual({ value: 13, unit: EstimateUnit.Hours })
    })

    it('should return nearest estimate in other unit', () => {
        const estimate: ValueUnitEstimate = { value: 15, unit: EstimateUnit.Hours }
        const result = getNearestBaseValueEstimate(estimate)

        expect(result).toEqual({ value: 2, unit: EstimateUnit.Days })
    })

    it('should return nearest estimate if same diff for many units', () => {
        const estimate: ValueUnitEstimate = { value: 40, unit: EstimateUnit.Hours }
        const result = getNearestBaseValueEstimate(estimate)

        // Minimal diff for 5 days == 1 week. Peak lowest unit
        expect(result).toEqual({ value: 5, unit: EstimateUnit.Days })
    })
})

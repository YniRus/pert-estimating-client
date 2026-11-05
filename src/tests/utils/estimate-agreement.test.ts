import { describe, expect, it } from 'vitest'
import { type Estimates, EstimateType, EstimateUnit, NonValueUnitEstimate } from '@/definitions/estimates'
import { calculateAgreement, calculateEstimatesAgreement } from '@/utils/estimate-agreement'

describe('estimate agreement', () => {
    it.each([{ values: [] }, { values: [5] }])('requires at least two numeric estimates: $values', ({ values }) => {
        expect(calculateAgreement(values)).toBeNull()
    })

    it.each([{ values: [0, 0] }, { values: [8, 8] }])('reports full agreement for identical estimates: $values', ({ values }) => {
        expect(calculateAgreement(values)).toBe(100)
    })

    it.each([
        { values: [85, 115], percentage: 85 },
        { values: [84, 116], percentage: 84 },
        { values: [70, 130], percentage: 70 },
        { values: [69, 131], percentage: 69 },
        { values: [0, 0, 100], percentage: 0 },
    ])('calculates $percentage% agreement', ({ values, percentage }) => {
        expect(calculateAgreement(values)).toBe(percentage)
    })

    it('is independent of the magnitude of estimates', () => {
        expect(calculateAgreement([8, 12])).toEqual(calculateAgreement([80, 120]))
    })

    it('normalizes units and substitutes missing types just like PERT', () => {
        const estimates: Estimates[] = [
            { min: { value: 1, unit: EstimateUnit.Days } },
            { probable: { value: 8, unit: EstimateUnit.Hours } },
        ]

        for (const type of [undefined, ...Object.values(EstimateType)]) {
            expect(calculateEstimatesAgreement(estimates, type)).toBe(100)
        }
    })

    it('compares PERT by default and individual types when requested', () => {
        const estimates: Estimates[] = [
            { min: { value: 0, unit: EstimateUnit.Hours }, probable: { value: 6, unit: EstimateUnit.Hours }, max: { value: 12, unit: EstimateUnit.Hours } },
            { min: { value: 6, unit: EstimateUnit.Hours } },
        ]

        expect(calculateEstimatesAgreement(estimates)).toBe(100)
        expect(calculateEstimatesAgreement(estimates, EstimateType.Min)).toBe(0)
        expect(calculateEstimatesAgreement(estimates, EstimateType.Max)).toBe(66.7)
    })

    it('excludes empty, hidden and nonnumeric estimates but substitutes nonnumeric types when possible', () => {
        const estimates: Estimates[] = [
            {},
            { min: '*' },
            { min: NonValueUnitEstimate.Chill, max: NonValueUnitEstimate.IDontKnow },
            { min: NonValueUnitEstimate.IDontKnow, probable: { value: 8, unit: EstimateUnit.Hours } },
        ]

        expect(calculateEstimatesAgreement(estimates)).toBeNull()
        estimates.push({ min: { value: 8, unit: EstimateUnit.Hours } })
        expect(calculateEstimatesAgreement(estimates, EstimateType.Min)).toBe(100)
    })
})

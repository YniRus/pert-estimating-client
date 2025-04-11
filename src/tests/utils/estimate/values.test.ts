import { describe, expect, it } from 'vitest'
import { baseEstimateValues, getMinimalNonZeroValue } from '@/utils/estimate/values'

describe('getMinimalNonZeroValue', () => {
    it('should return the second value when first is zero', () => {
        const result = getMinimalNonZeroValue(baseEstimateValues)

        expect(result).toBe(1)
    })

    it('should return the fallback value when the array is empty or with only zero', () => {
        const resultWithEmpty = getMinimalNonZeroValue([])

        expect(resultWithEmpty).toBe(1)

        const resultWithOnlyZero = getMinimalNonZeroValue([])

        expect(resultWithOnlyZero).toBe(1)

        const resultWithEmptyAndCustomFallbackValue = getMinimalNonZeroValue([], 0.1)

        expect(resultWithEmptyAndCustomFallbackValue).toBe(0.1)
    })

    it('should return the first value when it\'s greater than zero', () => {
        const result = getMinimalNonZeroValue([0.1, 0.2, 0.3])

        expect(result).toBe(0.1)
    })
})

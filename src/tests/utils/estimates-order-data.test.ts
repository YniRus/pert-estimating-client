import { expect, describe, it, beforeEach } from 'vitest'
import {
    getStoredEstimatesOrderDataIfValid,
    setEstimatesOrderDataToStorage,
    __forTestsOnly__,
} from '@/utils/estimates-order-data'
import { EstimateType } from '@/definitions/estimates'

describe('getStoredEstimatesOrderDataIfValid', () => {
    const { estimatesOrderStorageKey } = __forTestsOnly__

    beforeEach(() => {
        // Очистка localStorage перед каждым тестом
        localStorage.clear()
    })

    it('should return null if there is no data in localStorage', () => {
        const result = getStoredEstimatesOrderDataIfValid()

        expect(result).toBeNull()
    })

    it('should return null if the stored data is not valid JSON', () => {
        localStorage.setItem(estimatesOrderStorageKey, 'invalid-json')

        const result = getStoredEstimatesOrderDataIfValid()

        expect(result).toBeNull()
    })

    it('should return null if the stored data is valid JSON but does not pass validation', () => {
        const invalidData = { key: 'value' }
        localStorage.setItem(estimatesOrderStorageKey, JSON.stringify(invalidData))

        const result = getStoredEstimatesOrderDataIfValid()
        expect(result).toBeNull()
    })

    it('should return the parsed data if the stored data is valid JSON and passes validation', () => {
        const validData = [
            { type: EstimateType.Probable, disabled: false },
            { type: EstimateType.Min, disabled: true },
            { type: EstimateType.Max, disabled: true },
        ]
        localStorage.setItem(estimatesOrderStorageKey, JSON.stringify(validData))

        const result = getStoredEstimatesOrderDataIfValid()

        expect(result).toEqual(validData)
    })
})

describe('isValidEstimatesOrderData', () => {
    const { isValidEstimatesOrderData } = __forTestsOnly__

    it('should return false for non-array input', () => {
        expect(isValidEstimatesOrderData(null)).toBe(false)
        expect(isValidEstimatesOrderData('string')).toBe(false)
        expect(isValidEstimatesOrderData(42)).toBe(false)
        expect(isValidEstimatesOrderData({})).toBe(false)
    })

    it('should return false if array contains invalid values', () => {
        expect(isValidEstimatesOrderData([])).toBe(false)
        expect(isValidEstimatesOrderData([null])).toBe(false)
        expect(isValidEstimatesOrderData([{ type: 'invalid-type' }])).toBe(false)
        expect(isValidEstimatesOrderData([{ disabled: true }])).toBe(false)
        expect(isValidEstimatesOrderData([{ type: EstimateType.Probable, disabled: 'not-a-boolean' }])).toBe(false)
    })

    it('should return false for array with valid and invalid objects', () => {
        const invalidData = [
            { type: EstimateType.Max }, // Корректный объект
            { disabled: true }, // Некорректный объект
        ]
        expect(isValidEstimatesOrderData(invalidData)).toBe(false)
    })

    it('should return true for valid EstimatesOrderData', () => {
        const validData = [
            { type: EstimateType.Probable, disabled: false },
            { type: EstimateType.Min, disabled: true },
            { type: EstimateType.Max, disabled: true },
        ]
        expect(isValidEstimatesOrderData(validData)).toBe(true)
    })

    it('should return true if "disabled" is omitted', () => {
        const dataWithoutDisabled = [{ type: EstimateType.Probable }]
        expect(isValidEstimatesOrderData(dataWithoutDisabled)).toBe(true)
    })
})

describe('setEstimatesOrderDataToStorage', () => {
    const { estimatesOrderStorageKey } = __forTestsOnly__

    beforeEach(() => {
        localStorage.clear()
    })

    it('should set the correct data in localStorage with the specified key', () => {
        const estimatesOrderData = [
            { type: EstimateType.Probable, disabled: false },
            { type: EstimateType.Min, disabled: true },
            { type: EstimateType.Max, disabled: true },
        ]

        setEstimatesOrderDataToStorage(estimatesOrderData)

        const storedValue = localStorage.getItem(estimatesOrderStorageKey)
        expect(storedValue).toBe(JSON.stringify(estimatesOrderData))
    })

    it('should overwrite existing data in localStorage with the new data', () => {
        const oldData = [{ type: EstimateType.Probable }]
        localStorage.setItem(estimatesOrderStorageKey, JSON.stringify(oldData))

        const storedValue = localStorage.getItem(estimatesOrderStorageKey)
        expect(storedValue).toBe(JSON.stringify(oldData))

        const newData = [{ type: EstimateType.Min, disabled: false }]
        setEstimatesOrderDataToStorage(newData)

        const newStoredValue = localStorage.getItem(estimatesOrderStorageKey)
        expect(newStoredValue).toBe(JSON.stringify(newData))
    })
})

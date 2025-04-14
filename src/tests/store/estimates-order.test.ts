import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { useEstimatesOrderStore } from '@/store/estimates-order'
import type { EstimatesOrderData } from '@/definitions/estimates-order'
import { EstimateType } from '@/definitions/estimates'

import { getStoredEstimatesOrderDataIfValid } from '@/utils/estimates-order-data'

vi.mock('@/utils/estimates-order-data', () => ({
    getStoredEstimatesOrderDataIfValid: vi.fn(),
    setEstimatesOrderDataToStorage: vi.fn(),
}))

const getStoredEstimatesOrderDataIfValidMock = vi.mocked(getStoredEstimatesOrderDataIfValid)

describe('useEstimatesOrderStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    describe('data', () => {
        it('should return data from local storage', () => {
            const storedData: EstimatesOrderData = [
                { type: EstimateType.Probable },
                { type: EstimateType.Max, disabled: true },
            ]
            getStoredEstimatesOrderDataIfValidMock.mockReturnValue(storedData)

            const store = useEstimatesOrderStore()

            expect(store.data).toEqual(storedData)
        })

        it('should return default data if local storage data is unavailable', () => {
            const defaultData = [
                { type: EstimateType.Min },
                { type: EstimateType.Probable },
                { type: EstimateType.Max },
            ]
            getStoredEstimatesOrderDataIfValidMock.mockReturnValue(null)

            const store = useEstimatesOrderStore()

            expect(store.data).toEqual(defaultData)
        })
    })

    describe('order', () => {
        it('should return order by data from local storage', () => {
            const storedData: EstimatesOrderData = [
                { type: EstimateType.Probable },
                { type: EstimateType.Max, disabled: true },
            ]
            getStoredEstimatesOrderDataIfValidMock.mockReturnValue(storedData)

            const store = useEstimatesOrderStore()

            expect(store.order).toEqual([EstimateType.Probable])
        })

        it('should return order by default data if local storage data is unavailable', () => {
            getStoredEstimatesOrderDataIfValidMock.mockReturnValue(null)

            const store = useEstimatesOrderStore()

            expect(store.order).toEqual([EstimateType.Min, EstimateType.Probable, EstimateType.Max])
        })
    })

    describe('updateOrderData', () => {
        it('should update data and order when data updated', () => {
            getStoredEstimatesOrderDataIfValidMock.mockReturnValue(null)

            const initialData = [
                { type: EstimateType.Min },
                { type: EstimateType.Probable },
                { type: EstimateType.Max },
            ]

            const store = useEstimatesOrderStore(createTestingPinia({
                initialState: {
                    'estimates-order': {
                        data: [...initialData],
                    },
                },
                stubActions: false,
            }))

            expect(store.data).toEqual(initialData)
            expect(store.order).toEqual([EstimateType.Min, EstimateType.Probable, EstimateType.Max])

            const newData = [
                { type: EstimateType.Max },
                { type: EstimateType.Probable, disabled: true },
                { type: EstimateType.Min },
            ]

            store.updateOrderData(newData)

            expect(store.data).toEqual(newData)
            expect(store.order).toEqual([EstimateType.Max, EstimateType.Min])
        })
    })

    afterAll(() => {
        vi.restoreAllMocks()
    })
})

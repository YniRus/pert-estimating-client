import { describe, expect, it } from 'vitest'
import { swap } from '@/utils/utils'

describe('swap', () => {
    it('should work basically', () => {
        expect(swap([1, 2, 3], 0, 1)).toStrictEqual([2, 1, 3])
        expect(swap(['1', '2', '3'], 0, 1)).toStrictEqual(['2', '1', '3'])
    })

    it('should be immutable', () => {
        const source = [{ k1: 'v1' }, { k2: 'v2' }, { k3: 'v3' }]
        const result = swap(source, 0, 1)
        const expectResult = [{ k2: 'v2' }, { k1: 'v1' }, { k3: 'v3' }]

        expect(result).toStrictEqual(expectResult)

        delete source[0]

        expect(result).toStrictEqual(expectResult)

        source[1].k2 = 'another value'

        expect(result).toStrictEqual(expectResult)
    })

    it('should handle out of index', () => {
        expect(swap([1, 2, 3], 0, 4)).toStrictEqual([1, 2, 3])
        expect(swap([1, 2, 3], -1, 1)).toStrictEqual([1, 2, 3])
    })

    it('should return empty array for any nonarray source', () => {
        // @ts-expect-error eslint-disable-line @typescript-eslint/ban-ts-comment
        expect(swap(undefined, 0, 4)).toStrictEqual([])

        // @ts-expect-error eslint-disable-line @typescript-eslint/ban-ts-comment
        expect(swap({ k1: 'v1' }, -1, 1)).toStrictEqual([])
    })

    it('should return identity array when from equal`s to', () => {
        expect(swap([1, 2, 3], 0, 0)).toStrictEqual([1, 2, 3])
    })

    it('should return identity results when from and to are interchanged', () => {
        const expectResult = [2, 1, 3]

        expect(swap([1, 2, 3], 0, 1)).toStrictEqual(expectResult)
        expect(swap([1, 2, 3], 1, 0)).toStrictEqual(expectResult)
    })
})

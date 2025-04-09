export type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

export function truthy<T>(value: T): value is Truthy<T> {
    return Boolean(value)
}

export function isNumber(value: unknown): value is number {
    return Number.isFinite(value)
}

export function swap<T>(source: T[], from: number, to: number) {
    if (!Array.isArray(source)) return []
    const array = structuredClone(source)

    const isInvalidIndex = (index: number) => index < 0 || index > source.length - 1
    if ([from, to].some(isInvalidIndex)) return array;

    [array[to], array[from]] = [array[from], array[to]]

    return array
}

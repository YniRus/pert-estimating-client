import { type EstimateVariant, NonValueUnitEstimate } from '@/definitions/estimates'

export enum PredefinedEstimateValuesKey {
    ModifiedFibonacci = 'modified-fibonacci',
    EvenProbabilities = 'even-probabilities',
    EvenIntegers = 'even-integers',
}

export const predefinedEstimateValues: Record<PredefinedEstimateValuesKey, number[]> = {
    [PredefinedEstimateValuesKey.ModifiedFibonacci]: [0, 1, 2, 3, 5, 8, 13, 20],
    [PredefinedEstimateValuesKey.EvenProbabilities]: [0, 0.2, 0.4, 0.6, 0.8, 1],
    [PredefinedEstimateValuesKey.EvenIntegers]: [0, 0.5, 1, 2, 4, 6, 8, 10, 12, 14, 16],
}

export const baseEstimateValues = predefinedEstimateValues[PredefinedEstimateValuesKey.ModifiedFibonacci]
export const nonValueUnitEstimateVariants = Object.values(NonValueUnitEstimate)
export const defaultEstimateVariants: EstimateVariant[] = [...nonValueUnitEstimateVariants, ...baseEstimateValues]

export function getMinimalNonZeroValue(values: number[], fallbackValue = 1): number {
    const [firstValue, secondValue] = values

    return firstValue > 0 ? firstValue : secondValue || fallbackValue
}

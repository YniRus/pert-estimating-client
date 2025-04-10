import { NonValueUnitEstimate } from '@/definitions/estimates'

export enum PredefinedEstimateValuesKey {
    ModifiedFibonacci = 'modified-fibonacci',
    EvenProbabilities = 'even-probabilities',
    EvenIntegers = 'even-integers',
}

export const CustomEstimateValuesKey = 'custom'

export type EstimateValuesKey = PredefinedEstimateValuesKey | typeof CustomEstimateValuesKey

export const predefinedEstimateValues: Record<PredefinedEstimateValuesKey, number[]> = {
    [PredefinedEstimateValuesKey.ModifiedFibonacci]: [0, 1, 2, 3, 5, 8, 13, 20],
    [PredefinedEstimateValuesKey.EvenProbabilities]: [0, 0.2, 0.4, 0.6, 0.8, 1],
    [PredefinedEstimateValuesKey.EvenIntegers]: [0, 0.5, 1, 2, 4, 6, 8, 10, 12, 14, 16],
}

export const baseEstimateValues = predefinedEstimateValues[PredefinedEstimateValuesKey.ModifiedFibonacci]
export const nonValueUnitEstimateVariants = Object.values(NonValueUnitEstimate)

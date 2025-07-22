import type { PartialPick } from '@/definitions/utility'

export enum EstimateUnit {
    Hours = 'h',
    Days = 'd',
    Weeks = 'w',
    Months = 'm',
}

export enum EstimateType {
    Min = 'min',
    Probable = 'probable',
    Max = 'max',
}

export interface ValueUnitEstimate {
    value: number
    unit: EstimateUnit
}

export enum NonValueUnitEstimate {
    Chill = 'chill',
    IDontKnow = 'i-dont-know',
}

export type EstimateVariant = NonValueUnitEstimate | ValueUnitEstimate['value']

export const HIDDEN_ESTIMATE = '*'

export type Estimate = NonValueUnitEstimate | ValueUnitEstimate | typeof HIDDEN_ESTIMATE

export type UserSetEstimate = NonValueUnitEstimate | PartialPick<ValueUnitEstimate, 'unit'>

export type Estimates = Partial<Record<EstimateType, Estimate>>

export type UserEstimates = {
    estimates: Estimates
    confirmed?: boolean
}

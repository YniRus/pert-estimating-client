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

export type EstimatesOrder = EstimateType[]

export type EstimatesOrderData = EstimatesOrderDataItem[]

export interface EstimatesOrderDataItem {
    type: EstimateType
    disabled?: boolean
}

export interface ValueUnitEstimate {
    value: number
    unit: EstimateUnit
}

export enum NonValueUnitEstimate {
    Chill = 'chill',
    IDontKnow = 'i-dont-know',
}

export const HIDDEN_ESTIMATE = '*'

export type Estimate = NonValueUnitEstimate | ValueUnitEstimate | typeof HIDDEN_ESTIMATE

export type UserEstimate = NonValueUnitEstimate | PartialPick<ValueUnitEstimate, 'unit'>

export type Estimates = Partial<Record<EstimateType, Estimate>>

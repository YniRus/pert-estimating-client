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

export type EstimatesOrder = [EstimateType, EstimateType, EstimateType]

export interface ValueUnitEstimate {
    value: number
    unit: EstimateUnit
}

export const HIDDEN_ESTIMATE = '*'

export type Estimate = ValueUnitEstimate | typeof HIDDEN_ESTIMATE

export type Estimates = Partial<Record<EstimateType, Estimate>>

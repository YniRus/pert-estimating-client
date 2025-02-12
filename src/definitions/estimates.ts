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

export interface Estimate {
    value: EstimateValue
    unit: EstimateUnit
}

export type EstimateValue = number | '*'

export type Estimates = Partial<Record<EstimateType, Estimate>>

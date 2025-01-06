import { type Estimate, EstimateUnit} from '@/definitions/estimates'

export function getEstimateUnitColor(unit: EstimateUnit) {
    switch (unit) {
        case EstimateUnit.Hours: return 'primary'
        case EstimateUnit.Days: return 'success'
        case EstimateUnit.Weeks: return 'purple'
        case EstimateUnit.Months: return 'red'
    }
}

export function getEstimateValue(estimate?: Estimate) {
    return typeof estimate?.value === 'number' ? estimate.value : 0
}

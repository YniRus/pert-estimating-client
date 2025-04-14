import { EstimateUnit, NonValueUnitEstimate } from '@/definitions/estimates'

export function getEstimateUnitColor(unit: EstimateUnit) {
    switch (unit) {
        case EstimateUnit.Hours: return 'primary'
        case EstimateUnit.Days: return 'success'
        case EstimateUnit.Weeks: return 'purple'
        case EstimateUnit.Months: return 'red'
    }
}

export function getNonValueUnitEstimateIcon(estimate: NonValueUnitEstimate) {
    switch (estimate) {
        case NonValueUnitEstimate.Chill: return 'mdi-tea-outline'
        case NonValueUnitEstimate.IDontKnow: return 'mdi-help'
    }
}

import { type Estimate, type Estimates, EstimateUnit } from '@/definitions/estimates'
import { getEstimateValue } from '@/utils/estimate'

export function calculatePERT(estimates?: Estimates, digits = 2): Estimate {
    // TODO: Приводить к общему знаменателю

    const min = getEstimateValue(estimates?.min)
    const probable = getEstimateValue(estimates?.probable)
    const max = getEstimateValue(estimates?.max)

    const value = Number(((min + probable * 4 + max) / 6).toFixed(digits))
    const unit = EstimateUnit.Hours // TODO: Вычислять общий тип

    return { value, unit }
}

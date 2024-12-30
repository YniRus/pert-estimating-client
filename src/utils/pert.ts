import type { Estimates } from '@/definitions/estimates'

export function calculatePERT(estimate?: Estimates, digits = 2) {
    return Number((((estimate?.min || 0) + (estimate?.probable || 0) * 4 + (estimate?.max || 0)) / 6).toFixed(digits))
}

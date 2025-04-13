import { type EstimateVariant } from '@/definitions/estimates'
import type { UID } from '@/definitions/aliases'
import { PredefinedEstimateValuesKey } from '@/utils/estimate/values'

export type EstimateVariantsSetId = PredefinedEstimateValuesKey | UID

export interface EstimateVariantsSet {
    id: EstimateVariantsSetId
    name: string
    variants: EstimateVariant[]
}

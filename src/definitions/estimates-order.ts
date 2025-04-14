import { EstimateType } from '@/definitions/estimates'

export type EstimatesOrder = EstimateType[]

export type EstimatesOrderData = EstimatesOrderDataItem[]

export interface EstimatesOrderDataItem {
    type: EstimateType
    disabled?: boolean
}
